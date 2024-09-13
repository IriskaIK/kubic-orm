import IncompatibleActionError from "@/utils/errorHandlers/IncompatibleActionError";
import * as process from "node:process";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import logger from "@/utils/logger/logger";
import ValidationError from "@/utils/errorHandlers/ValidationError";
import queryBuilderValidator from "@/utils/validators/queryBuilder.validator";

type ConditionOperator = '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE';

type CRUDTableOperation = 'insert' | 'select' | 'update' | 'delete';


interface Condition {
    field: string;
    operator: ConditionOperator;
    value: any;
    type?: 'AND' | 'OR'; // To support AND/OR combinations
    nestedConditions?: Condition[]; // For nested conditions
}

interface Join {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    on: string;
}

interface QueryBuilderOptions {
    table: string;
}


class QueryBuilderBase {
    private table: string;
    private columns: string[] = ['*'];
    private conditions: Condition[] = [];
    private joins: Join[] = [];
    private limit?: number;
    private offset?: number;
    private isDistinct: boolean = false; //Determines if DISTINCT should be used

    private CRUDOperation: CRUDTableOperation = 'select';
    private dataToSet: Record<string, any> = {};


    constructor(options: QueryBuilderOptions) {
        QueryBuilderValidator.validateTableName(options.table)

        this.table = options.table;
    }


    where(condition: Condition): QueryBuilderBase {
        queryBuilderValidator.validateColumnName(condition.field)

        this.conditions.push(condition);
        return this;
    }

    andWhere(condition: Condition): QueryBuilderBase {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.type = 'AND';
        this.conditions.push(condition);
        return this;
    }

    orWhere(condition: Condition): QueryBuilderBase {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.type = 'OR';
        this.conditions.push(condition);
        return this;
    }

    whereNested(nestedConditions: Condition[]): QueryBuilderBase {
        // TODO: Rewrite logic to include nested conditions for joins
        // TODO: Validate nested WHERE clause
        this.conditions.push({nestedConditions, field: '', operator: '=', value: '', type: 'AND'});
        return this;
    }

    limitTo(limit: number): QueryBuilderBase {
        QueryBuilderValidator.validateLimitAndOffsetValue(limit, "LIMIT")
        this.limit = limit;
        return this;
    }

    offsetBy(offset: number): QueryBuilderBase {
        QueryBuilderValidator.validateLimitAndOffsetValue(offset, "OFFSET")
        this.offset = offset;
        return this;
    }

    distinct(): QueryBuilderBase {
        this.isDistinct = true;
        return this;
    }

    join(type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        this.joins.push({type, table, on});
        return this;
    }

    innerJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('INNER', table, on);
    }

    leftJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('LEFT', table, on);
    }

    rightJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('RIGHT', table, on);
    }

    fullJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('FULL', table, on);
    }

    select(columns: string[]): QueryBuilderBase {
        for (const column of columns) {
            QueryBuilderValidator.validateColumnName(column)
        }

        this.CRUDOperation = 'select';
        this.columns = columns;
        return this;
    }

    insert(data: Record<string, any>): QueryBuilderBase {
        this.CRUDOperation = 'insert';
        this.dataToSet = data;
        return this;
    }

    update(data: Record<string, any>): QueryBuilderBase {
        this.CRUDOperation = 'update';
        this.dataToSet = data;
        return this;
    }

    delete(): QueryBuilderBase {
        this.CRUDOperation = 'delete';

        return this;
    }

    private buildConditions(conditions: Condition[]): string {
        return conditions.map(condition => {
            if (condition.nestedConditions) {
                return `(${this.buildConditions(condition.nestedConditions)})`;
            }

            const {field, operator, value, type} = condition;
            const conditionStr = `${field} ${operator} '${value}'`;
            return type ? `${type} ${conditionStr}` : conditionStr;
        }).join(' ');
    }


    private generateWhereClause() : string{
        if(this.CRUDOperation === 'insert'){
            const error = new IncompatibleActionError("Cannot use WHERE clause with INSERT operation");
            logger.error(error);
            throw error;
        }


        let query : string = '';
        if (this.conditions.length) {
            const conditionsString = this.buildConditions(this.conditions);
            query += ` WHERE ${conditionsString}`;
        }
        return query;
    }

    private generateJoinClause() : string{
        if(this.CRUDOperation !== 'select'){
            const error = new IncompatibleActionError(`Cannot use JOIN clause with ${this.CRUDOperation.toUpperCase()} operation`);
            logger.error(error);
            throw error;
        }


        let query : string = '';

        if (this.joins.length) {
            const joinStrings = this.joins.map(join => `${join.type} JOIN ${join.table} ON ${join.on}`).join(' ');
            query += ` ${joinStrings}`;
        }

        return query;
    }

    private generateLimitClause() : string{
        if(this.CRUDOperation !== 'select'){
            const error = new IncompatibleActionError(`Cannot use LIMIT with ${this.CRUDOperation.toUpperCase()} operation`);
            logger.error(error);
            throw error;
        }


        let query : string = '';

        if (this.limit !== undefined) {
            query += ` LIMIT ${this.limit}`;
        }
        return query;
    }

    private generateOffsetClause() : string{
        if(this.CRUDOperation !== 'select'){
            const error = new IncompatibleActionError(`Cannot use OFFSET with ${this.CRUDOperation.toUpperCase()} operation`);
            logger.error(error);
            throw error;
        }


        let query : string = '';

        if (this.offset !== undefined) {
            query += ` OFFSET ${this.offset}`;
        }
        return query;
    }


    toSQL(): string {
        let query: string
        switch (this.CRUDOperation) {
            case "select":
                const distinct = this.isDistinct ? "DISTINCT " : "";
                query = `SELECT ${distinct}${this.columns.join(', ')} FROM ${this.table}`
                break;
            case "insert":
                const keys = Object.keys(this.dataToSet).join(', ');
                const values = "'" + Object.values(this.dataToSet).join("', '") + "'";
                query = `INSERT INTO ${this.table} (${keys}) VALUES (${values})`
                break;
            case "update":
                const setClause = Object.keys(this.dataToSet)
                    .map((key) => `${key} = '${this.dataToSet[key]}'`)
                    .join(', ');
                query = `UPDATE ${this.table} SET ${setClause}`
                break;
            case "delete":
                query = `DELETE FROM ${this.table}`
                break;

        }
        query += this.generateJoinClause()
        query += this.generateWhereClause()
        query += this.generateLimitClause()
        query += this.generateOffsetClause()

        return query;
    }

}

export default QueryBuilderBase;