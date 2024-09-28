import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/types/query.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class ManyToManyRelation<S, R extends Model> extends Relation<S, R> {

    constructor(sourceModelClass: Constructor<S>, relatedModelClass: Constructor<R>, columns: string[], relationName : string) {
        super(sourceModelClass, relatedModelClass, columns, relationName);
    }

    public createJoinClause(): Join[] {
        const through = this.sourceModelClass.relations[this.relationName].join.through
        if(!through){
            // TODO : add Error for not setting through values
            throw new Error('')
        }

        return [
            // First join: Source table -> Through table
            {
                type: 'INNER',
                tables : {
                    sourceTable : this.sourceTableName,
                    relatedTable : through.tableName
                },
                on: {
                    leftColumn: {
                        column: this.sourceIdentiferColumn, // Foreign key in source table
                        parentTable: this.sourceTableName
                    },
                    rightColumn: {
                        column: through.from,
                        parentTable : through.tableName

                    }
                }
            },
            {
                type: 'INNER',
                tables : {
                  sourceTable : through.tableName,
                  relatedTable:  this.relatedTableName
                },
                on: {
                    leftColumn: {
                        column : through.to,
                        parentTable : through.tableName
                    },
                    rightColumn: {
                        column: this.relatedIdentiferColumn, // Primary key in related table
                        parentTable: this.relatedTableName
                    }
                }
            }
        ];
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass);
        return query;
    }
}