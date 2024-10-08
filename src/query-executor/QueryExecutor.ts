import Connection from "@/database/Connection";
import {Column, Condition, Join, JoinCondition, Query} from "@/types/query.types";
import {Constructor} from "@/types/model.types";
import Model from "@/base-model/baseModel";
import logger from "@/utils/logger/logger";
import {QueryResultsMapper} from "@/query-results-mapper/QueryResultsMapper";
import QueryBuilderBase from "@/query-builder/queryBuilderBase";
import {ColumnNameReference, ResultMappingColumnPrototype} from "@/types/mapper.types";

class QueryExecutor<T extends Model> {
    private query : Query<T>;
    private mappedResultModelPrototype : ResultMappingColumnPrototype = {
        'origin' : []
    };



    constructor(query: Query<T>) {
        this.query = query;
    }

    private mapColumnNameToResultModelPrototype(column: string, relationName? : string, alias? : string){
        if(relationName){
            this.mappedResultModelPrototype[relationName].push({column, alias});
        }else{
            this.mappedResultModelPrototype['origin'].push({column, alias});
        }
    }




    private getColumnSQLString(column: Column, relationName? : string) {
        return `"${column.parentTable ? column.parentTable + '"."' : ''}${column.column}"${column.alias ? ` AS "${column.alias}"` : ""}`
    }

    private assignTableNameToColumn(column: Column, tableName: string) {
        if(!column.parentTable){
            column.parentTable = tableName
        }
        return column
    }

    private selectAllColumns(query : Query<Model>, relationName? : string){
        let columnsArray: string[] = []
        query.model.columns.forEach(column => {
            columnsArray.push(`"${query.table}"."${column}"`)
            this.mapColumnNameToResultModelPrototype(column, relationName)
        })
        return columnsArray
    }

    private groupColumnsByTableName(query : Query<Model>, relationName? : string) : string[]{
        let columnsArray: string[] = []
        if(query.columns.length === 0){
            columnsArray = this.selectAllColumns(query, relationName)
            return columnsArray
        }
        query.columns.forEach((column) =>{
            if(column.column === '*'){
                columnsArray = this.selectAllColumns(query, relationName)
                return columnsArray
            }
            if(column.alias){
                this.mapColumnNameToResultModelPrototype(column.column, relationName, column.alias)
            }else{
                this.mapColumnNameToResultModelPrototype(column.column, relationName)
            }
            columnsArray.push(this.getColumnSQLString(this.assignTableNameToColumn(column, query.table), relationName))
        })
        return columnsArray
    }

    private buildSelectClause() {
        const distinct = this.query.distinct ? "DISTINCT " : "";
        let columnsArray: string[] = []
        columnsArray = columnsArray.concat(this.groupColumnsByTableName(this.query));

        for(const [key, value] of Object.entries(this.query.relationsQueries)){
            this.mappedResultModelPrototype[key] = [];
            columnsArray = columnsArray.concat(this.groupColumnsByTableName(value, key))
        }

        return `SELECT ${distinct}${columnsArray.join(', ')} FROM "${this.query.table}"`
    }



    private groupConditions(conditions: Condition[]): string {
        return conditions.map(condition => {
            if (condition.nestedConditions) {
                return `(${this.groupConditions(condition.nestedConditions)})`;
            }

            const { column, operator, value, logicalOperator, compareColumn } = condition;

            let valueStr;
            if (Array.isArray(value))
                valueStr = `(${(value as string[]).map(v => `${v}`).join(', ')})`;
            else
                valueStr = compareColumn ? this.getColumnSQLString(compareColumn) : `"${value}"`;


            const conditionStr = `${this.getColumnSQLString(column)} ${operator} ${valueStr}`;
            return logicalOperator ? `${logicalOperator} ${conditionStr}` : conditionStr;
        }).join(' ');
    }

    private buildWhereClause() {
        let queryString: string = '';
        if (this.query.conditions.length) {
            const conditionsString = this.groupConditions(this.query.conditions);
            queryString += ` WHERE ${conditionsString}`;
        }
        return queryString;
    }

    private parseJoin(on: JoinCondition) {
        return `${this.getColumnSQLString(on.leftColumn)} = ${this.getColumnSQLString(on.rightColumn)}`
    }

    private buildJoinClause() {

        let queryString: string = '';

        if (this.query.joins.length) {
            const joinStrings = this.query.joins.map(join => `${join.type} JOIN "${join.tables.relatedTable}" ${join.on ? "ON " + this.parseJoin(join.on) : ''}`).join(' ');
            queryString += ` ${joinStrings}`;
        }

        return queryString;
    }

    private buildOffsetClause() {


        let queryString: string = '';

        if (this.query.offset !== undefined) {
            queryString += ` OFFSET ${this.query.offset}`;
        }
        return queryString;
    }

    private buildLimitClause() {

        let queryString: string = '';

        if (this.query.limit !== undefined) {
            queryString += ` LIMIT ${this.query.limit}`;
        }
        return queryString;
    }



    // TODO: Change to private. Public only for tests
    public toSQL(): string {
        let queryString = '';
        queryString += this.buildSelectClause();
        queryString += this.buildJoinClause();
        queryString += this.buildWhereClause();
        queryString += this.buildLimitClause();
        queryString += this.buildOffsetClause();
        return queryString;
    }

    public async execute() : Promise<T[]> {
        const SQLQuery = this.toSQL()

        console.log(this.mappedResultModelPrototype)

        logger.info(`Generated query: ${SQLQuery}`)

        const result = (await Connection.getInstance().query(SQLQuery)).rows
        logger.info(`Query results: ${JSON.stringify(result)}`)

        const mappedInstances = QueryResultsMapper.mapResultsToModelInstances(result, this.query.model, this.query.relationsQueries, this.mappedResultModelPrototype)
        logger.info(`Mapped instances: ${JSON.stringify(mappedInstances)}`)



        return mappedInstances
    }


}


export default QueryExecutor;