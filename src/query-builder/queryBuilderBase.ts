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
        this.table = options.table;
    }


    where(condition: Condition): QueryBuilderBase {
        this.conditions.push(condition);
        return this;
    }

    andWhere(condition: Condition): QueryBuilderBase {
        condition.type = 'AND';
        this.conditions.push(condition);
        return this;
    }

    orWhere(condition: Condition): QueryBuilderBase {
        condition.type = 'OR';
        this.conditions.push(condition);
        return this;
    }

    whereNested(nestedConditions: Condition[]): QueryBuilderBase {
        // TODO: Rewrite logic to include nested conditions for joins
        this.conditions.push({nestedConditions, field: '', operator: '=', value: '', type: 'AND'});
        return this;
    }

    limitTo(limit: number): QueryBuilderBase {
        this.limit = limit;
        return this;
    }

    offsetBy(offset: number): QueryBuilderBase {
        this.offset = offset;
        return this;
    }

    distinct(): QueryBuilderBase {
        this.isDistinct = true;
        return this;
    }

    join(type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', table: string, on: string): QueryBuilderBase {
        this.joins.push({type, table, on});
        return this;
    }

    innerJoin(table: string, on: string): QueryBuilderBase {
        return this.join('INNER', table, on);
    }

    leftJoin(table: string, on: string): QueryBuilderBase {
        return this.join('LEFT', table, on);
    }

    rightJoin(table: string, on: string): QueryBuilderBase {
        return this.join('RIGHT', table, on);
    }

    fullJoin(table: string, on: string): QueryBuilderBase {
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

    select(columns: string[]): QueryBuilderBase {
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


    generateWhereClause() : string{
        // TODO: if it is insert operation - throw an error
        let query : string = '';
        if (this.conditions.length) {
            const conditionsString = this.buildConditions(this.conditions);
            query += ` WHERE ${conditionsString}`;
        }
        return query;
    }

    generateJoinClause() : string{
        // TODO: if it is NOT select operation - throw an error

        let query : string = '';

        if (this.joins.length) {
            const joinStrings = this.joins.map(join => `${join.type} JOIN ${join.table} ON ${join.on}`).join(' ');
            query += ` ${joinStrings}`;
        }

        return query;
    }

    generateLimitClause() : string{
        // TODO: if it is NOT select operation - throw an error
        let query : string = '';

        if (this.limit !== undefined) {
            query += ` LIMIT ${this.limit}`;
        }
        return query;
    }

    generateOffsetClause() : string{
        // TODO: if it is NOT select operation - throw an error
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