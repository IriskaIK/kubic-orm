import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import { Join} from "@/types/query.types";
import {Constructor} from "@/types/model.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class ManyToManyRelation<S extends Model, R extends Model> extends Relation<S, R> {

    constructor(sourceModelClass: Constructor<S>, relatedModelClass: Constructor<R>, columns: string[], relationName : string) {
        super(sourceModelClass, relatedModelClass, columns, relationName);
    }

    public createJoinClause(): Join[] {
        const through = this.sourceModelClass.relations[this.relationName].join.through
        if(!through){
            // TODO : add Error for not setting through values
            throw new Error('')
        }
        const throughFrom = this.parseColumn(through.from)
        const throughTo = this.parseColumn(through.to)

        return [
            {
                type: 'INNER',
                tables : {
                    sourceTable : this.sourceTableName,
                    relatedTable : through.tableName
                },
                on: {
                    leftColumn: this.sourceIdentifierColumn,
                    rightColumn: throughFrom
                }
            },
            {
                type: 'INNER',
                tables : {
                  sourceTable : through.tableName,
                  relatedTable:  this.relatedTableName
                },
                on: {
                    leftColumn: throughTo,
                    rightColumn: this.relatedIdentifierColumn
                }
            }
        ];
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass);
        return query;
    }
}