import {Relation} from "@/relations/Relation";
import {Model} from "@/base-model/baseModel";
import {Constructor, Join} from "@/types/query.types";
import {QueryBuilder} from "@/query-builder/queryBuilder";


export class HasManyRelation<S, R extends Model> extends Relation<S, R>{

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[]) {
        super(sourceModelClass, relatedModelClass, columns);
    }

    public createJoinClause(): Join[] {
        return [{
            type: 'INNER',
            // tables: [this.sourceModelClass.tableName, this.relatedModelClass.tableName],
            tables : {
                sourceTable : this.sourceTableName,
                relatedTable : this.relatedTableName
            },
            on: {
                leftColumn: {
                    column: this.sourceIdentiferColumn, // Primary key from source model
                    parentTable: this.sourceTableName
                },
                rightColumn: {
                    column: this.relatedIdentiferColumn, // Foreign key from related model
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