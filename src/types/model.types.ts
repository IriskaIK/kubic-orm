import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";

export interface RelationMapping {
    relation: typeof Relation;
    model: typeof Model;

    join: {
        from: string;      // source table
        to: string;        // related table
        throughTable?: {        // Optional for ManyToMany
            // TODO: Decide whether its needed or not!
         //   tableName: string;  // intermediary table
            from: string;       // Foreign key in through table linking to source table
            to: string;         // Foreign key in through table linking to related table
        };
    };
}

export interface RelationalMappings {
    [key : string] : RelationMapping
}

export interface Constructor<T> {
    new (...args: any[]): T;
    tableName: string;
    relations : RelationalMappings;
}