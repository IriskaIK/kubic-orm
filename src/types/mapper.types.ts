export type ColumnNameReference = {
    column : string,
    alias? : string,
}

export type ResultMappingColumnPrototype = Record<string, ColumnNameReference[]>;