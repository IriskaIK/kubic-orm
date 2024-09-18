import QueryBuilderBase from "@/query-builder/queryBuilderBase";

import Model from "@/base-model/baseModel";
import queryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import formatStringWithDot from "@/utils/helpers/formatStringWithDot.helper";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import { Condition} from "@/types/query.types";

import {RelationalMappings, Constructor} from "@/types/model.types";


class QueryBuilder<T extends Model> extends QueryBuilderBase<T> {

    constructor(modelClass : Constructor<T>) {
        super(modelClass);

    }

    public select(columns: string[]): QueryBuilder<T> {
        if(columns[0] !== '*'){
            columns.forEach((element, index) => {
                queryBuilderValidator.validateColumnName(element);
                columns[index] = formatStringWithDot(element);
            })
        }
        this.CRUDOperation = 'select';
        this.columns = columns;
        return this;
    }


    public limitTo(limit: number): QueryBuilder<T>  {
        QueryBuilderValidator.validateLimitAndOffsetValue(limit, "LIMIT")
        this.limit = limit;
        return this;
    }

    public offsetBy(offset: number): QueryBuilder<T>  {
        QueryBuilderValidator.validateLimitAndOffsetValue(offset, "OFFSET")
        this.offset = offset;
        return this;
    }


    public distinct(): QueryBuilder<T>  {
        this.isDistinct = true;
        return this;
    }

    public insert(data: Record<string, any>): QueryBuilder<T>  {
        this.CRUDOperation = 'insert';
        this.dataToSet = data;
        return this;
    }

    public update(data: Record<string, any>): QueryBuilder<T>  {
        this.CRUDOperation = 'update';
        this.dataToSet = data;
        return this;
    }

    public delete(): QueryBuilder<T>  {
        this.CRUDOperation = 'delete';

        return this;
    }

    public where(condition: Condition): QueryBuilder<T>  {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.field = formatStringWithDot(condition.field)
        this.conditions.push(condition);
        return this;
    }

    public andWhere(condition: Condition): QueryBuilder<T>  {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.type = 'AND';
        condition.field = formatStringWithDot(condition.field)
        this.conditions.push(condition);
        return this;
    }

    public orWhere(condition: Condition): QueryBuilder<T>  {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.field = formatStringWithDot(condition.field)
        condition.type = 'OR';
        this.conditions.push(condition);
        return this;
    }

    public whereNested(nestedConditions: Condition[]): QueryBuilder<T>  {
        // TODO: Rewrite logic to include nested conditions for joins
        // TODO: Validate nested WHERE clause
        this.conditions.push({nestedConditions, field: '', operator: '=', value: '', type: 'AND'});
        return this;
    }

    public withRelations() : QueryBuilder<T>  {
        this.mapRelations();
        return this;
    }





}


export default QueryBuilder;