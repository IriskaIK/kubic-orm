import QueryBuilderBase from "@/query-builder/queryBuilderBase";

import Model from "@/base-model/baseModel";
import queryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import formatStringWithDot from "@/utils/helpers/formatStringWithDot.helper";
import QueryBuilderValidator from "@/utils/validators/queryBuilder.validator";
import {ConditionOperator} from "@/types/queryTypes";

interface QueryBuilderOptions {
    table: string;
    model : typeof Model;
}

interface Condition {
    field: string;
    operator: ConditionOperator;
    value: any;
    type?: 'AND' | 'OR'; // To support AND/OR combinations
    nestedConditions?: Condition[]; // For nested conditions
}

class QueryBuilder extends QueryBuilderBase{

    constructor(options: QueryBuilderOptions) {
        super(options);

    }

    public select(columns: string[]): QueryBuilder {
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


    public limitTo(limit: number): QueryBuilder {
        QueryBuilderValidator.validateLimitAndOffsetValue(limit, "LIMIT")
        this.limit = limit;
        return this;
    }

    public offsetBy(offset: number): QueryBuilder {
        QueryBuilderValidator.validateLimitAndOffsetValue(offset, "OFFSET")
        this.offset = offset;
        return this;
    }


    public distinct(): QueryBuilder {
        this.isDistinct = true;
        return this;
    }

    public insert(data: Record<string, any>): QueryBuilder {
        this.CRUDOperation = 'insert';
        this.dataToSet = data;
        return this;
    }

    public update(data: Record<string, any>): QueryBuilder {
        this.CRUDOperation = 'update';
        this.dataToSet = data;
        return this;
    }

    public delete(): QueryBuilder {
        this.CRUDOperation = 'delete';

        return this;
    }

    public where(condition: Condition): QueryBuilder {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.field = formatStringWithDot(condition.field)
        this.conditions.push(condition);
        return this;
    }

    public andWhere(condition: Condition): QueryBuilder {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.type = 'AND';
        condition.field = formatStringWithDot(condition.field)
        this.conditions.push(condition);
        return this;
    }

    public orWhere(condition: Condition): QueryBuilder {
        queryBuilderValidator.validateColumnName(condition.field)

        condition.field = formatStringWithDot(condition.field)
        condition.type = 'OR';
        this.conditions.push(condition);
        return this;
    }

    public whereNested(nestedConditions: Condition[]): QueryBuilder {
        // TODO: Rewrite logic to include nested conditions for joins
        // TODO: Validate nested WHERE clause
        this.conditions.push({nestedConditions, field: '', operator: '=', value: '', type: 'AND'});
        return this;
    }

    public withRelations() : QueryBuilder {
        this.mapRelations();
        return this;
    }





}


export default QueryBuilder;