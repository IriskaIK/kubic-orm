import Connection from "@/database/Connection";
import {Column, Condition, Join, JoinCondition, Query} from "@/types/query.types";
import {Constructor} from "@/types/model.types";
import Model from "@/base-model/baseModel";
import logger from "@/utils/logger/logger";
import {QueryResultsMapper} from "@/query-results-mapper/QueryResultsMapper";
import {ColumnMapper} from "@/query-executor/ColumnMapper";
import {ConditionMapper} from "@/query-executor/ConditionMapper";

class QueryExecutor<T extends Model> {

    private static getColumnSQLString(column: Column) {
        if(column.column == '*'){
            return `*`
        }
        return `"${column.parentTable ? column.parentTable + '"."' : ''}${column.column}"${column.alias ? ` AS "${column.alias}"` : ""}`
    }

    private static buildSelectClause<T extends Model>(query : Query<T>) {
        const distinct = query.distinct ? "DISTINCT " : "";
        const columnMapper = new ColumnMapper(query)
        return `SELECT ${distinct}${columnMapper.groupColumns().join(', ')} FROM "${query.table}"`
    }


    private static buildJoinOnClause(on: JoinCondition) {
        return `${this.getColumnSQLString(on.leftColumn)} = ${this.getColumnSQLString(on.rightColumn)}`
    }

    private static buildWhereClause<T extends Model>(query : Query<T>) {
        let queryString: string = '';
        if (query.conditions.length) {
            const conditionMapper = new ConditionMapper(query);
            const conditionsString = conditionMapper.groupConditions(query.conditions)
            queryString += ` WHERE ${conditionsString}`;
        }
        return queryString;
    }


    private static buildJoinClause(joins: Join[]) {



        let query: string = '';

        if (joins.length) {
            const joinStrings = joins.map(join => `${join.type} JOIN "${join.tables.relatedTable}" ${join.on ? "ON " + this.buildJoinOnClause(join.on) : ''}`).join(' ');
            query += ` ${joinStrings}`;
        }

        return query;
    }

    private static buildOffsetClause(offset: number | undefined) {


        let query: string = '';

        if (offset !== undefined) {
            query += ` OFFSET ${offset}`;
        }
        return query;
    }

    private static buildLimitClause(limit: number | undefined) {

        let query: string = '';

        if (limit !== undefined) {
            query += ` LIMIT ${limit}`;
        }
        return query;
    }

    // TODO: change to private. Public only for tests
    public static toSQL<T extends Model>(query: Query<T>): string {
        let queryString = '';
        queryString += this.buildSelectClause(query);
        queryString += this.buildJoinClause(query.joins);
        queryString += this.buildWhereClause(query);
        queryString += this.buildLimitClause(query.limit);
        queryString += this.buildOffsetClause(query.offset);
        return queryString;
    }

    public static async execute<T extends Model>(query: Query<T>) : Promise<T[]> {
        const SQLQuery = this.toSQL(query)

        logger.info(`Generated query: ${SQLQuery}`)


        const result = (await Connection.getInstance().query(SQLQuery)).rows
        logger.info(`Query results: ${JSON.stringify(result)}`)

        const mappedInstances = QueryResultsMapper.mapResultsToModelInstances(result, query.model, query.relations)
        logger.info(`Mapped instances: ${JSON.stringify(mappedInstances)}`)

        return mappedInstances
    }

}


export default QueryExecutor;