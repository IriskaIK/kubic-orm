import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import Model from "@/base-model/baseModel";
import {RelationalMappings, Constructor} from "@/types/model.types";


import {Query, Column, Operator, LogicalOperator} from "@/types/query.types";
import QueryExecutor from "@/query-executor/QueryExecutor";
import {BelongsToOneRelation} from "@/relations/BelongsToOne/BelongsToOneRelation";

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
            distinct : false,
            relations : []
        }


    }


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

    private checkForAmbiguousColumns(column : Column) : boolean{
        return this.query.columns.some((col)=>{
            return col.column === column.column && col.parentTable === column.parentTable && col.alias === column.alias
        })
    }

    protected addColumn(column : string){

        const parsedColumn = this.parseColumn(column)

        if(this.checkForAmbiguousColumns(parsedColumn)){
            // TODO: log an error
            throw new Error(`Ambiguous columns: ${column}`)
        }

        this.query.columns.push(parsedColumn)
    }



    protected addCondition(column : string, operator : Operator, value? : string | string[], compareColumn? : string, logicalOperator? : LogicalOperator){
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


    protected handleJoinRelation(relationName : string){
        const relation = this.query.model.relations[relationName]
        const joinClause = new relation.relation(this.query.model, relation.model, [], relationName).createJoinClause()

        this.query.relations.push(relationName)
        this.query.joins.push(...joinClause)
    }

    public async execute() : Promise<T[]>{
        const results = await QueryExecutor.execute(this.query)

        return results

    }

    public getSQL(){
        return QueryExecutor.toSQL(this.query)
    }


}

export default QueryBuilderBase;