import IncompatibleActionError from "@/utils/errorHandlers/IncompatibleActionError";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import logger from "@/utils/logger/logger";
import {ConditionOperator} from "@/types/queryTypes";
import formatStringWithDot from "@/utils/helpers/formatStringWithDot.helper"
import Model from "@/base-model/baseModel";
import Connection from "@/database/Connection";



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
    model : typeof Model;
}


class QueryBuilderBase {
    protected table: string;
    protected model : typeof Model;
    protected columns: string[] = ['*'];
    protected conditions: Condition[] = [];
    protected joins: Join[] = [];
    protected limit?: number;
    protected offset?: number;
    protected isDistinct: boolean = false; //Determines if DISTINCT should be used

    protected CRUDOperation: CRUDTableOperation = 'select';
    protected dataToSet: Record<string, any> = {};


    constructor(options: QueryBuilderOptions) {
        QueryBuilderValidator.validateTableName(options.table)
        this.table = options.table;
        this.model = options.model;
    }

    protected join(type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)

        // TODO: Validate ON
        this.joins.push({type, table, on : formatStringWithDot(on)});
        return this;
    }

    protected innerJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('INNER', table, on);
    }

    protected leftJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('LEFT', table, on);
    }

    protected rightJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('RIGHT', table, on);
    }

    protected fullJoin(table: string, on: string): QueryBuilderBase {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('FULL', table, on);
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
            const joinStrings = this.joins.map(join => `${join.type} JOIN "${join.table}" ON ${join.on}`).join(' ');
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


    protected createJoinClause(from: string, to: string, tableName : string){
        this.innerJoin(tableName, `${from} = ${to}`)
        this.columns.push(`row_to_json("${tableName}") AS ${tableName}`)
    }

    protected mapRelations(){
        for(const key in this.model.relations){
            if(this.model.relations.hasOwnProperty(key)){
                const mapping = this.model.relations[key];
                const tableNameToJoin = mapping.model.tableName
                const from = mapping.join.from;
                const to = mapping.join.to;
                this.createJoinClause(from, to, tableNameToJoin)
            }
        }

    }


    public toSQL(): string {
        let query: string
        switch (this.CRUDOperation) {
            case "select":
                const distinct = this.isDistinct ? "DISTINCT " : "";
                query = `SELECT ${distinct}${this.columns.join(', ')} FROM "${this.table}"`
                break;
            case "insert":
                const keys = Object.keys(this.dataToSet).join(', ');
                const values = "'" + Object.values(this.dataToSet).join("', '") + "'";
                query = `INSERT INTO "${this.table}" (${keys}) VALUES (${values})`
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

        logger.info(query)

        return query;
    }

    private mapQueryResultsToModel(result : object[]){
        let mappedInstances : Model[] = [];
        result.forEach((e)=>{
            const instance = new this.model()
            Object.assign(instance, e)
            mappedInstances.push(instance)
        })
        return mappedInstances;
    }



    public async execute() {
        const result = (await Connection.getInstance().query(this.toSQL())).rows
        await Connection.getInstance().close()
        return this.mapQueryResultsToModel(result);
    }



}

export default QueryBuilderBase;