import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import {Model} from "@/base-model/baseModel";
import {RelationalMappings, Constructor} from "@/types/model.types";


import {Query, Column, Operator, LogicalOperator} from "@/types/query.types";
import QueryExecutor from "@/query-executor/QueryExecutor";


/**
 * Base class for building SQL queries for models.
 * This class provides foundational methods to add columns, conditions, joins,
 * limits, and other query components, and it manages the internal query structure.
 *
 * @template T The model type that extends the base `Model`.
 */
export class QueryBuilderBase<T extends Model> {

    // protected dataToSet: Record<string, any> = {};

    /**
     * The internal query structure being built, containing information like the
     * columns, conditions, joins, table, and more.
     *
     * @protected
     * @type {Query<T>}
     */
    protected query: Query<T>;


    /**
     * Initializes a query builder for a specific model.
     * Validates the table name and sets the default query structure.
     *
     * @param modelClass The model class to generate queries for.
     */
    constructor(modelClass: Constructor<T>) {
        QueryBuilderValidator.validateTableName(modelClass.tableName)
        this.query = {
            crudOperation : "SELECT",
            model: modelClass,
            table: modelClass.tableName,
            columns: [],
            conditions: [],
            joins: [],
            distinct : false
        }
    }


    /**
     * Parses a column string, handling aliasing and table references.
     * Supports column syntax like `table.column` and `column AS alias`.
     *
     * @private
     * @param {string} column - The column string to parse.
     * @param {string} [alias] - Optional alias for the column.
     * @returns {Column} The parsed column object.
     */
    private parseColumn(column: string, alias? : string): Column {
        // TODO: Validate column
        if(column.includes(' AS ')){
            const [col, alias] = column.split(" AS ")
            return this.parseColumn(col, alias)
        }
        if (column.includes('.')) {
            const [table, col] = column.split('.')
            return {column: col, parentTable: table, alias : alias}
        } else {
            return {column: column, alias : alias}
        }
    }

    /**
     * Adds a column to the SELECT statement of the query.
     *
     * @protected
     * @param {string} column - The column to add.
     */
    protected addColumn(column : string){
        this.query.columns.push(this.parseColumn(column))
    }

    /**
     * Adds a condition to the WHERE clause of the query.
     * The condition can be based on a value or another column, with optional logical operators.
     *
     * @protected
     * @param {string} column - The column for the condition.
     * @param {Operator} operator - The comparison operator.
     * @param {string} [value] - The value for the condition.
     * @param {string} [compareColumn] - An optional column to compare with.
     * @param {LogicalOperator} [logicalOperator] - Optional logical operator (e.g., AND, OR).
     */
    protected addCondition(column : string, operator : Operator, value? : string, compareColumn? : string, logicalOperator? : LogicalOperator){
        this.query.conditions.push({
            column : this.parseColumn(column),
            operator : operator,
            compareColumn : compareColumn ? this.parseColumn(compareColumn) : undefined,
            value : value ? value : undefined,
            logicalOperator : logicalOperator ? logicalOperator : undefined
        })
    }

    /**
     * Adds a join clause to the query.
     * Supports INNER, LEFT, RIGHT, and FULL joins between tables.
     *
     * @protected
     * @param {'INNER' | 'LEFT' | 'RIGHT' | 'FULL'} type - The type of join to perform.
     * @param {string} table - The table to join with.
     * @param {string} on - The join condition in the format "leftColumn = rightColumn".
     * @returns {QueryBuilderBase<T>} The current query builder instance for method chaining.
     */
    protected join(type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)

        const [left, right] = on.split('=')
        // TODO: Validate ON
        this.query.joins.push({
            type: type,
            tables: {
                sourceTable: this.query.model.tableName,
                relatedTable: table
            },
            on: {
                leftColumn: this.parseColumn(left.trim()),
                rightColumn: this.parseColumn(right.trim())
            }
        });
        return this;
    }

    /**
     * Sets the LIMIT clause for the query, restricting the number of rows returned.
     *
     * @protected
     * @param {number} limit - The maximum number of rows to return.
     */
    protected setLimit(limit : number){
        this.query.limit = limit;
    }

    /**
     * Sets the OFFSET clause for the query, skipping a specified number of rows.
     *
     * @protected
     * @param {number} offset - The number of rows to skip before starting to return rows.
     */
    protected setOffset(offset : number){
        this.query.offset = offset;
    }

    /**
     * Marks the query as DISTINCT, ensuring only unique rows are returned.
     *
     * @protected
     */
    protected setDistinct(){
        this.query.distinct = true;
    }

    // public async execute() : Promise<T[]> {
    //     const result = (await Connection.getInstance().query(this.toSQL())).rows
    //     return this.mapQueryResultsToModel(result);
    // }

    // TODO : Write docs for this method, when it will be fully implemented
    public async execute(){
        await QueryExecutor.execute(this.query)
        // console.log(this.query)
    }


    /**
     * Returns the SQL string representation of the current query.
     *
     * @returns {string} The SQL query as a string.
     */
    public getSQL() : string{
        return QueryExecutor.toSQL(this.query)
    }


}

