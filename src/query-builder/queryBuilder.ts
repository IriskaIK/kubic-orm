import {QueryBuilderBase} from "@/query-builder/queryBuilderBase";

import {Model} from "@/base-model/baseModel";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";

import {RelationalMappings, Constructor} from "@/types/model.types";
import {Operator} from "@/types/query.types";

/**
 * A class responsible for building SQL queries for a specific model.
 * Extends the base functionality provided by `QueryBuilderBase`.
 * This class allows you to build complex SQL queries with methods for selection,
 * joins, limits, offsets, and conditions (`WHERE`, `AND`, `OR`).
 *
 * @template T The model type that the query is built for, extending the base `Model`.
 */
export class QueryBuilder<T extends Model> extends QueryBuilderBase<T> {

    /**
     * Creates an instance of QueryBuilder for a specific model class.
     * @param modelClass The model class for which the query is being built.
     */
    constructor(modelClass: Constructor<T>) {
        super(modelClass);
    }


    /**
     * Adds columns to the SELECT statement of the query.
     *
     * @param {string[]} columns - Array of column names to select in the query.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public select(columns: string[]): QueryBuilder<T> {
        columns.forEach((col) => {
            this.addColumn(col)
        })
        return this;
    }


    /**
     * Adds an INNER JOIN to the query.
     *
     * @param {string} table - The name of the table to join.
     * @param {string} on - The condition on which the join will occur.
     * @returns {QueryBuilderBase<T>} The current query builder instance for method chaining.
     */
    public innerJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('INNER', table, on);
    }


    /**
     * Adds a LEFT JOIN to the query.
     *
     * @param {string} table - The name of the table to join.
     * @param {string} on - The condition on which the join will occur.
     * @returns {QueryBuilderBase<T>} The current query builder instance for method chaining.
     */
    public leftJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('LEFT', table, on);
    }



    /**
     * Adds a RIGHT JOIN to the query.
     *
     * @param {string} table - The name of the table to join.
     * @param {string} on - The condition on which the join will occur.
     * @returns {QueryBuilderBase<T>} The current query builder instance for method chaining.
     */
    public rightJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('RIGHT', table, on);
    }


    /**
     * Adds a FULL JOIN to the query.
     *
     * @param {string} table - The name of the table to join.
     * @param {string} on - The condition on which the join will occur.
     * @returns {QueryBuilderBase<T>} The current query builder instance for method chaining.
     */
    public fullJoin(table: string, on: string): QueryBuilderBase<T> {
        QueryBuilderValidator.validateTableName(table)
        // TODO: Validate ON
        return this.join('FULL', table, on);
    }

    /**
     * Adds a LIMIT clause to the query.
     *
     * @param {number} limit - The maximum number of rows to return.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public limitTo(limit: number): QueryBuilder<T> {
        QueryBuilderValidator.validateLimitAndOffsetValue(limit, "LIMIT")
        this.setLimit(limit)
        return this;
    }


    /**
     * Adds an OFFSET clause to the query.
     *
     * @param {number} offset - The number of rows to skip before starting to return rows.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public offsetBy(offset: number): QueryBuilder<T> {
        QueryBuilderValidator.validateLimitAndOffsetValue(offset, "OFFSET")
        this.setOffset(offset)
        return this;
    }


    /**
     * Adds a WHERE clause to the query.
     *
     * @param {string} column - The column name for the condition.
     * @param {Operator} operator - The operator to use in the condition (e.g., '=', '>', '<').
     * @param {string} [value] - The value to compare the column with.
     * @param {string} [compareColumn] - An optional second column for comparison.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public where(column : string, operator : Operator, value? : string, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column);
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn)
        return this;
    }


    /**
     * Adds an AND WHERE clause to the query.
     *
     * @param {string} column - The column name for the condition.
     * @param {Operator} operator - The operator to use in the condition.
     * @param {string} [value] - The value to compare the column with.
     * @param {string} [compareColumn] - An optional second column for comparison.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public andWhere(column : string, operator : Operator, value? : string, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column)
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "AND")
        return this;
    }


    /**
     * Adds an OR WHERE clause to the query.
     *
     * @param {string} column - The column name for the condition.
     * @param {Operator} operator - The operator to use in the condition.
     * @param {string} [value] - The value to compare the column with.
     * @param {string} [compareColumn] - An optional second column for comparison.
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public orWhere(column : string, operator : Operator, value? : string, compareColumn? : string): QueryBuilder<T> {
        QueryBuilderValidator.validateColumnName(column)
        compareColumn && QueryBuilderValidator.validateColumnName(compareColumn);
        this.addCondition(column, operator, value, compareColumn, "OR")
        return this;
    }


    /**
     * Marks the query to return distinct rows only.
     *
     * @returns {QueryBuilder<T>} The current query builder instance for method chaining.
     */
    public distinct(): QueryBuilder<T>  {
        this.setDistinct();
        return this;
    }


    // public insert(data: Record<string, any>): QueryBuilder<T>  {
    //     this.CRUDOperation = 'insert';
    //     this.dataToSet = data;
    //     return this;
    // }


    // public update(data: Record<string, any>): QueryBuilder<T>  {
    //     this.CRUDOperation = 'update';
    //     this.dataToSet = data;
    //     return this;
    // }


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
