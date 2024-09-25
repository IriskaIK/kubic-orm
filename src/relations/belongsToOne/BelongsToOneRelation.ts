import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/types/query.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class BelongsToOneRelation<S, R extends Model> extends Relation<S, R>{

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[]) {
        super(sourceModelClass, relatedModelClass, columns);
    }


    public createJoinClause(): Join[] {
        return [{
            type: 'INNER',
            tables: [this.sourceModelClass.tableName, this.relatedModelClass.tableName],
            on: [{
                leftColumn: {
                    column: this.sourceIdentiferColumn, // Foreign key
                    parentTable: this.sourceModelClass.tableName
                },
                rightColumn: {
                    column: this.relatedIdentiferColumn, // Primary key
                    parentTable: this.relatedModelClass.tableName
                }
            }]
        }];
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass)
        return query;
    }

}