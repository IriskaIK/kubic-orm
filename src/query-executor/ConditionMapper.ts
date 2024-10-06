import Model from "@/base-model/baseModel";
import {ColumnOperations} from "@/query-executor/ColumnOperations";
import {Condition} from "@/types/query.types";
import {Query} from "@/types/query.types";
export class ConditionMapper<T extends Model> extends ColumnOperations {
    private readonly query: Query<T>;

    constructor(query: Query<T>) {
        super();
        this.query = query;
    }


    public groupConditions(conditions: Condition[]): string {
        return conditions.map(condition => {
            if (condition.nestedConditions) {
                return `(${this.groupConditions(condition.nestedConditions)})`;
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


}