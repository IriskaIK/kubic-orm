import {Relation} from "@/relations/Relation";
import {Model} from "@/base-model/baseModel";

export type Column = {
    column : string,
    alias? : string,
    parentTable? : string,
}


// Conditions
export type Operator = '=' | '<>' | '>' | '<' | '>=' | '<=';
export type LogicalOperator = "AND" | "OR";
export type Condition = {
    column : Column,
    operator : Operator,
    value? : Column | string,
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
    subQueries? : Query<T>; // needed to improve
    unions? : Query<T>[]; // needed to improve
}

export interface Constructor<T> {
    new (...args: any[]): T;
    tableName: string;
    relations : RelationalMappings;
}

export interface RelationMapping {
    relation : typeof Relation,
    model : typeof Model,
    join : {
        from : string,
        to : string,
        through? : {
            to : string,
            from : string,
            tableName : string
        }
    }
}

export interface RelationalMappings {
    [key : string] : RelationMapping
}


