import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";

export type Column = {
    column : string,
    alias? : string,
    parentTable? : string,
}


// Conditions
type Operator = '=' | '<>' | '>' | '<' | '>=' | '<=';
type LogicalOperator = "AND" | "OR";
type Condition = {
    column : Column,
    operator : Operator,
    value? : Column | string,
    logicalOperator? : LogicalOperator,
    nestedConditions? : Condition[],
}

// Joins
type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';
interface JoinCondition {
    leftColumn : Column,
    rightColumn : Column
}
export interface Join {
    type : JoinType,
    tables : [string, string]
    on? : JoinCondition[];
}


// Relations

export interface Query {
    table : string;
    columns : Column[] | '*';
    conditions : Condition[];
    joins : Join[];
    offset? : number;
    limit? : number;
    subQueries? : Query; // needed to improve
    unions : Query[]; // needed to improve
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
        through? : string
    }
}

export interface RelationalMappings {
    [key : string] : RelationMapping
}


