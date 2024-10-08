import QueryBuilderBase from "@/query-builder/queryBuilderBase";

import Model from "@/base-model/baseModel";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";

import {RelationalMappings, Constructor} from "@/types/model.types";
import {LogicalOperator, Operator} from "@/types/query.types";


class QueryBuilder<T extends Model> extends QueryBuilderBase<T> {

    constructor(modelClass: Constructor<T>) {
        super(modelClass);
    }


    public select(columns: string[]): QueryBuilder<T> {
        columns.forEach((col) => {
            this.addColumn(col)
        })
        return this;
    }


    public innerJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('INNER', table, on);
    }

    public leftJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('LEFT', table, on);
    }

    public rightJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('RIGHT', table, on);
    }


    public fullJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('FULL', table, on);
    }

    public limitTo(limit: number): QueryBuilder<T> {
        QueryBuilderValidator.validateLimitAndOffsetValue(limit, "LIMIT")
        this.setLimit(limit)
        return this;
    }

    public offsetBy(offset: number): QueryBuilder<T> {
        QueryBuilderValidator.validateLimitAndOffsetValue(offset, "OFFSET")
        this.setOffset(offset)
        return this;
    }

    public where(column : string, operator : Operator, value? : string | number, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        const stringValue = typeof value === "number" ? value.toString() : value;
        this.addCondition(column, operator, stringValue, compareColumn)
        return this;
    }

    public andWhere(column : string, operator : Operator, value? : string, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column)
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "AND")
        return this;
    }

    public orWhere(column : string, operator : Operator, value? : string, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column)
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "OR")
        return this;
    }

    public whereNot(column: string, operator: Operator, value?: string, compareColumn?: string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "AND NOT");
        return this;
    }

    public orWhereNot(column: string, operator: Operator, value?: string, compareColumn?: string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "OR NOT");
        return this;
    }


    public whereNested(callback: (qb: QueryBuilder<T>) => void, logicalOperator: LogicalOperator = "AND"): QueryBuilder<T> {
        const nestedQueryBuilder = new QueryBuilder<T>(this.query.model);
        callback(nestedQueryBuilder);
        this.query.conditions.push({
            column: { column: '' },
            operator: '=',
            nestedConditions: nestedQueryBuilder.query.conditions,
            logicalOperator: logicalOperator
        });

        return this;
    }

    public whereIn(column: string, values: (string | number)[]): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);

        const stringValues = values.map(value => {return value.toString();});

        this.query.conditions.push({
            column: { column: column },
            operator: 'IN',
            value: stringValues,
        });

        return this;
    }

    public orWhereIn(column: string, values: (string | number)[]): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        const stringValues = values.map(value => value.toString());
        this.addCondition(column, "IN", stringValues, undefined, "OR");

        return this;
    }

    public whereNotIn(column: string, values: (string | number)[]): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        const stringValues = values.map(value => value.toString());
        this.addCondition(column, "NOT IN", stringValues);

        return this;
    }

    public orWhereNotIn(column: string, values: (string | number)[]): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column); // Validate the column name
        const stringValues = values.map(value => value.toString()); // Ensure all values are strings
        this.addCondition(column, "NOT IN", stringValues, undefined, "OR"); // Add the condition with the "OR" operator
        return this;
    }

    public distinct(): QueryBuilder<T>  {
        this.setDistinct();
        return this;
    }

    public findById(id: string | number) {
        // Validate the column name
        QueryBuilderValidator.validateColumnName("id");
        this.addCondition("id", "=", id.toString());
        return this;
    }

    public findByIds(ids: (string | number)[]) {
        // Validate the column name
        QueryBuilderValidator.validateColumnName("id");
        const stringIds = ids.map(id => id.toString());
        this.addCondition("id", "IN", stringIds);
        return this;
    }

    public findOne(): QueryBuilder<T> {
        this.limitTo(1);
        return this;
    }

    public orderBy(...orderBys: { column: string; direction?: 'ASC' | 'DESC' }[]): QueryBuilder<T> {
        orderBys.forEach(orderBy => {
            this.query.orderBy.push({
                column: orderBy.column,
                direction: orderBy.direction || 'ASC'
            });
        });

        return this;
    }


    public groupBy(...columns: string[]): QueryBuilder<T> {
        this.query.groupBy.push(...columns);
        return this;
    }

    public avg(column: string, aliasName: string): QueryBuilder<T> {
        this.query.columns.push({
            column: `AVG(${column})`,
            alias: `${aliasName}`
        });
        return this;
    }

    public sum(column: string, aliasName: string): QueryBuilder<T> {
        this.query.columns.push({
            column: `SUM(${column})`,
            alias: `${aliasName}`
        });
        return this;
    }

    public joinRelation(relation : string, modifiers?: (qb: QueryBuilder<Model>) => void) : QueryBuilder<T>{
        this.handleJoinRelation(relation, modifiers)
        return this;
    }



    // public insert(data: Record<string, any>): QueryBuilder<T>  {
    //     this.CRUDOperation = 'insert';
    //     this.dataToSet = data;
    //     return this;
    // }
    //
    // public update(data: Record<string, any>): QueryBuilder<T>  {
    //     this.CRUDOperation = 'update';
    //     this.dataToSet = data;
    //     return this;
    // }
    //
    // public delete(): QueryBuilder<T>  {
    //     this.CRUDOperation = 'delete';
    //
    //     return this;
    // }

    // public withRelations() : QueryBuilder<T>  {
    //     this.mapRelations();
    //     return this;
    // }



}


export default QueryBuilder;