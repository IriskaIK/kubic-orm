import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/types/query.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class BelongsToOneRelation<S, R extends Model> extends Relation<S, R>{

    constructor(sourceModelClass: Constructor<S>, relatedModelClass: Constructor<R>, columns: string[], relationName : string) {
        super(sourceModelClass, relatedModelClass, columns, relationName);
    }



    public createJoinClause(): Join[] {
        return [{
            type: 'INNER',
            tables : {
                sourceTable : this.sourceTableName,
                relatedTable : this.relatedTableName
            },
            on: {
                leftColumn: {
                    column: this.sourceIdentiferColumn, // Foreign key
                    parentTable: this.sourceTableName
                },
                rightColumn: {
                    column: this.relatedIdentiferColumn, // Primary key
                    parentTable: this.relatedTableName
                }
            }
        }];
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass)
        return query;
    }

}