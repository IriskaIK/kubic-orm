import Model from "@/base-model/baseModel";

export type ConditionOperator = '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE';

export type CRUDTableOperation = 'insert' | 'select' | 'update' | 'delete';


export interface Join {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    on: string;
}

export interface Condition {
    field: string;
    operator: ConditionOperator;
    value: any;
    type?: 'AND' | 'OR'; // To support AND/OR combinations
    nestedConditions?: Condition[]; // For nested conditions
}

export interface QueryBuilderOptions {
    table: string;
    model : typeof Model;
}
