import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor} from "@/types/model.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export type Column = {
    column : string,
    alias? : string,
    parentTable? : string,
}


// Conditions
export type Operator = '=' | '<>' | '>' | '<' | '>=' | '<=' | "IN" | "NOT IN";
export type LogicalOperator = "AND" | "OR" | "AND NOT" | "OR NOT";
export type Condition = {
    column : Column,
    operator : Operator,
    value? : Column | string | string[] | Column[],
    compareColumn? : Column,
    logicalOperator? : LogicalOperator,
    nestedConditions? : Condition[],
}

// Joins
type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';
export interface JoinCondition {
    leftColumn : Column,
    rightColumn : Column
}
export interface Join {
    type : JoinType,
    tables : {
        sourceTable : string,
        relatedTable : string
    }
    on? : JoinCondition;
}

//OrderBy
export interface OrderBy {
    column: string;
    direction: 'ASC' | 'DESC';
}

type SQLOperation = "SELECT" | "INSERT" | "UPDATE" | "DELETE";


// Relations

export interface Query<T extends Model> {
    crudOperation : SQLOperation;
    model : Constructor<T>;
    table : string;
    distinct : boolean;
    columns : Column[];
    conditions : Condition[];
    joins : Join[];
    offset? : number;
    limit? : number;
    groupBy: string[];
    orderBy: OrderBy[];
    subQueries? : Query<T>; // needed to improve
    unions? : Query<T>[]; // needed to improve
    // relations : string[];
    relationsQueries : Record<string, Query<Model>>;
}



