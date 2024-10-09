import Model from "@/base-model/baseModel";
import {Constructor} from "@/types/model.types";
import {Column} from "@/types/query.types";

export type ColumnNameReference = {
    column : string,
    alias? : string,
}

export type ResultMappingColumnPrototype = Record<string, ColumnNameReference[]>;


export interface ResultMappingModelPrototype<T extends Model, R extends Model>{
    tableName : string;
    model : Constructor<T | R>;
    columns : Column[];
    relations : Record<string, ResultMappingModelPrototype<T, R>>;
}