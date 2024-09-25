import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import Model from "@/base-model/baseModel";
import {RelationalMappings, Constructor} from "@/types/model.types";


import {Query, Column, Operator, LogicalOperator} from "@/types/query.types";
import QueryExecutor from "@/query-executor/QueryExecutor";

class QueryBuilderBase<T extends Model> {

    // protected dataToSet: Record<string, any> = {};


    protected query: Query<T>;

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


    private parseColumn(column: string): Column {
        // TODO: Validate column
        if (column.includes('.')) {
            const [table, col] = column.split('.')
            return {column: col, parentTable: table}
        } else {
            return {column: column}
        }
    }

    protected addColumn(column : string){
        this.query.columns.push(this.parseColumn(column))
    }

    protected addCondition(column : string, operator : Operator, value? : string, compareColumn? : string, logicalOperator? : LogicalOperator){
        this.query.conditions.push({
            column : this.parseColumn(column),
            operator : operator,
            compareColumn : compareColumn ? this.parseColumn(compareColumn) : undefined,
            value : value ? value : undefined,
            logicalOperator : logicalOperator ? logicalOperator : undefined
        })
    }

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

    protected setLimit(limit : number){
        this.query.limit = limit;
    }

    protected setOffset(offset : number){
        this.query.offset = offset;
    }

    protected setDistinct(){
        this.query.distinct = true;
    }

    // public async execute() : Promise<T[]> {
    //     const result = (await Connection.getInstance().query(this.toSQL())).rows
    //     return this.mapQueryResultsToModel(result);
    // }

    public async execute(){
        await QueryExecutor.execute(this.query)
        // console.log(this.query)
    }


    public getSQL(){
        return QueryExecutor.toSQL(this.query)
    }


}

export default QueryBuilderBase;