import Connection from "@/database/Connection";
import {Column, Condition, Join, JoinCondition, Query} from "@/types/query.types";
import {Model} from "@/base-model/baseModel";

class QueryExecutor {

    private static getColumnSQLString(column: Column) {
        return `"${column.parentTable ? column.parentTable + '"."' : ''}${column.column}"${column.alias ? ` AS "${column.alias}"` : ""}`
    }

    private static buildConditions(conditions: Condition[]): string {
        return conditions.map(condition => {
            if (condition.nestedConditions) {
                return `(${this.buildConditions(condition.nestedConditions)})`;
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

    private static buildJoinOnClause(on: JoinCondition) {
        return `${this.getColumnSQLString(on.leftColumn)} = ${this.getColumnSQLString(on.rightColumn)}`
    }

    private static buildSelectClause(columns: Column[], tableName: string, isDistinct: boolean) {
        const distinct = isDistinct ? "DISTINCT " : "";
        let columnsArray: string[] = []

        if(columns.length === 0){
            return `SELECT ${distinct}* FROM "${tableName}"`
        }
        columns.forEach((column) => {
            columnsArray.push(this.getColumnSQLString(column))
        })
        return `SELECT ${distinct}${columnsArray.join(', ')} FROM "${tableName}"`
    }

    private static buildWhereClause(conditions: Condition[]) {
        // if(this.CRUDOperation === 'insert'){
        //     const error = new IncompatibleActionError("Cannot use WHERE clause with INSERT operation");
        //     logger.error(error);
        //     throw error;
        // }


        let query: string = '';
        if (conditions.length) {
            const conditionsString = this.buildConditions(conditions);
            query += ` WHERE ${conditionsString}`;
        }
        return query;
    }


    private static buildJoinClause(joins: Join[]) {
        // if(this.CRUDOperation !== 'select'){
        //     const error = new IncompatibleActionError(`Cannot use JOIN clause with ${this.CRUDOperation.toUpperCase()} operation`);
        //     logger.error(error);
        //     throw error;
        // }


        let query: string = '';

        if (joins.length) {
            const joinStrings = joins.map(join => `${join.type} JOIN "${join.tables.relatedTable}" ${join.on ? "ON " + this.buildJoinOnClause(join.on) : ''}`).join(' ');
            query += ` ${joinStrings}`;
        }

        return query;
    }

    private static buildOffsetClause(offset: number | undefined) {
        // if(this.CRUDOperation !== 'select'){
        //     const error = new IncompatibleActionError(`Cannot use OFFSET with ${this.CRUDOperation.toUpperCase()} operation`);
        //     logger.error(error);
        //     throw error;
        // }

        let query: string = '';

        if (offset !== undefined) {
            query += ` OFFSET ${offset}`;
        }
        return query;
    }

    private static buildLimitClause(limit: number | undefined) {
        // if(this.CRUDOperation !== 'select'){
        //     const error = new IncompatibleActionError(`Cannot use LIMIT with ${this.CRUDOperation.toUpperCase()} operation`);
        //     logger.error(error);
        //     throw error;
        // }

        let query: string = '';

        if (limit !== undefined) {
            query += ` LIMIT ${limit}`;
        }
        return query;
    }

    // TODO: change to private. Public only for tests
    public static toSQL<T extends Model>(query: Query<T>): string {
        let queryString = '';
        queryString += this.buildSelectClause(query.columns, query.table, query.distinct);
        queryString += this.buildJoinClause(query.joins);
        queryString += this.buildWhereClause(query.conditions);
        queryString += this.buildLimitClause(query.limit);
        queryString += this.buildOffsetClause(query.offset);
        return queryString;
    }

    public static async execute<T extends Model>(query: Query<T>) {
        console.log(this.toSQL(query))
        // const result = (await Connection.getInstance().query(this.toSQL(query))).rows
    }

}


export default QueryExecutor;