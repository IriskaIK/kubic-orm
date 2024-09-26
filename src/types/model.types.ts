import {Relation} from "@/relations/Relation";
import {Model} from "@/base-model/baseModel";

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

export interface Constructor<T> {
    new (...args: any[]): T;
    tableName: string;
    relations : RelationalMappings;
}