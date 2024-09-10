
type ConditionOperator = '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE';

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

interface QueryBuilderOptions{
    table : string;
}


class QueryBuilderBase{
    private table : string;
    private columns : string[] = ['*'];
    private conditions : Condition[] = [];
    private joins: Join[] = [];
    private limit?: number;
    private offset?: number;


    constructor(options : QueryBuilderOptions) {
        this.table = options.table;
    }


    select(columns : string[]) : QueryBuilderBase{
        this.columns = columns;
        return this;
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
        this.conditions.push({ nestedConditions, field: '', operator: '=', value: '', type: 'AND' });
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

    join(type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL', table: string, on: string): QueryBuilderBase {
        this.joins.push({ type, table, on });
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

            const { field, operator, value, type } = condition;
            const conditionStr = `${field} ${operator} '${value}'`;
            return type ? `${type} ${conditionStr}` : conditionStr;
        }).join(' ');
    }




    insert(data: Record<string, any>): string {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

        return `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    }

    update(data: Record<string, any>, conditions: Record<string, any>): string {
        const setClause = Object.keys(data)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const conditionClause = Object.keys(conditions)
            .map((key, index) => `${key} = $${Object.keys(data).length + index + 1}`)
            .join(' AND ');

        return `UPDATE ${this.table} SET ${setClause} WHERE ${conditionClause} RETURNING *`;
    }

    delete(conditions: Record<string, any>): string {
        const conditionClause = Object.keys(conditions)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(' AND ');

        return `DELETE FROM ${this.table} WHERE ${conditionClause}`;
    }

    toSQL(): string{
        let query = `SELECT ${this.columns.join(', ')} FROM ${this.table}`;

        if (this.joins.length) {
            const joinStrings = this.joins.map(join => `${join.type} JOIN ${join.table} ON ${join.on}`).join(' ');
            query += ` ${joinStrings}`;
        }

        if (this.conditions.length) {
            const conditionsString = this.buildConditions(this.conditions);
            query += ` WHERE ${conditionsString}`;
        }

        if (this.limit !== undefined) {
            query += ` LIMIT ${this.limit}`;
        }

        if (this.offset !== undefined) {
            query += ` OFFSET ${this.offset}`;
        }

        return query;
    }


}

export default QueryBuilderBase;