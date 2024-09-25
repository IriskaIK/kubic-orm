import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/relations/types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class ManyToManyRelation<S, R extends Model> extends Relation<S, R>{

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[]) {
        super(sourceModelClass, relatedModelClass, columns);
    }


    // Table C has columns for both A and B
    // tables' identifiers. This relationship is called
    // ManyToManyRelation in objection. Each row in
    // C joins one A with one B . Therefore, an A
    // row can be related to multiple B rows and a
    // B row can be related to multiple A rows
    // through table С.
    // Create INNER JOIN between A -> C and C -> B
    public createJoinClause(): Join[] {
        const joins: Join[] = [];

        // 1st Join: A (sourceModelClass) -> C (throughTable)
        joins.push({
            type: 'INNER',
            tables: [this.sourceModelClass.tableName, this.throughTable],
            on: [{
                leftColumn: {
                    column: this.sourceIdentiferColumn,
                    parentTable: this.sourceModelClass.tableName
                },
                rightColumn: {
                    column: `${this.sourceModelClass.tableName}_id`,
                    parentTable: this.throughTable
                }
            }]
        });

        // 2nd Join: C -> B (relatedModelClass)
        joins.push({
            type: 'INNER',
            tables: [this.throughTable, this.relatedModelClass.tableName],
            on: [{
                leftColumn: {
                    column: `${this.relatedModelClass.tableName}_id`,
                    parentTable: this.throughTable
                },
                rightColumn: {
                    column: this.relatedIdentiferColumn,
                    parentTable: this.relatedModelClass.tableName
                }
            }]
        });

        return joins;
    }


    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass)
        return query;
    }



}
