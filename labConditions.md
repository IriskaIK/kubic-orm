# Lab1

### At least 9 classes:

- [`QueryBuilderBase`](src/query-builder/queryBuilderBase.ts)
- [`QueyBuilder`](src/query-builder/queryBuilder.ts)
- [`Model`](src/base-model/baseModel.ts)
- [`QueryExecutor`](src/query-executor/QueryExecutor.ts)
- [`QueryResultsMapper`](src/query-results-mapper/QueryResultsMapper.ts)
- [`Relation`](src/relations/Relation.ts)
- [`ManyToManyRelation`](src/relations/ManyToManyRelation/ManyToManyRelation.ts)
- [`HasManyRelations`](src/relations/HasManyRelations/HasManyRealtions.ts)
- [`BelongsToOneRelation`](src/relations/BelongsToOne/BelongsToOneRelation.ts)
- [`CustomErrorBase`](src/utils/errorHandlers/CustomError.ts)
- [`IncompatibleActionError`](src/utils/errorHandlers/IncompatibleActionError.ts)
- [`ValidationError`](src/utils/errorHandlers/ValidationError.ts)
- [`QueryBuilderValidator`](src/utils/validators/queryBuilder.validator.ts)

### At least 15 fields(properties):

- `QueryBuilderBase`
  - `query`
- `QueryExecutor`
  - `query`
  - `mappedResultModelPrototype`
- `Model`
  - `query`
  - `connection`
  - `[key : string] : any` (i think its counting as field)
  - `tableName` (not field, but custom getter)
  - `relations` (not field, but custom getter)
  - `columns` (not field, but custom getter)
  - `$query` (not field, but custom getter)
- `Relation`
  - `relationName`
  - `relationName`
  - `relatedTableName`
  - `sourceModelClass`
  - `relatedModelClass`
  - `sourceIdentifierColumn`
  - `relatedIdentifierColumn`
  - `toSelectColumns`

### At least 25 non-trivial methods

- `QueryBuilderBase`
  - `parseColumn`
  - `checkForAmbiguousColumns`
  - `addColumn`
  - `addCondition`
  - `join`
  - `handleJoinRelation`
  - `execute`
  - `getSQL`
- `QuryBuilder`
  - `avg`
  - `sum`
  - `orderBy`
  - `findByIds`
- `QueryExecutor`
  - `mapColumnNameToResultModelPrototype`
  - `getColumnSQLString`
  - `assignTableNameToColumn`
  - `selectAllColumns`
  - `groupColumnsByTableName`
  - `buildSelectClause`
  - `groupConditions`
  - `buildWhereClause`
  - `parseJoin`
  - `buildJoinClause`
  - `buildOffsetClause`
  - `buildLimitClause`
  - `toSQL`
  - `execute`
- `QueryResultsMapper`
  - `mapDataToInstance`
  - `mapResultsToModelInstances`
- `ManyToManyRelation` / `HasManyRelation` / `BelongsToOneRelation` (each of them has own implementation of the following methods)
  - `createJoinClause`
  - `createQuery`
- `QueryBuilderValidator`
  - `validateTableName`
  - `validateColumnName`
  - `validateOperator`
  - `validateLimitAndOffsetValue`

### At least 2 inheritance hierarchies, at least one of which contains at least 3 classes:

- `Relation`
  - `ManyToManyRelation`
  - `HasManyRelations`
  - `BelongsToOneRelation`
- `QueryBuilderBase`
  - `QueyBuilder`
- `CustomErrorBase`
  - `IncompatibleActionError`
  - `ValidationError`

### Dynamic polymorphism

- `Relation`
    - `ManyToManyRelation`
    - `HasManyRelations`
    - `BelongsToOneRelation`

### Static polymorphism

- `Coming soon for QueryBuilder methods`