import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/relations/types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class ManyToManyRelation<S, R extends Model> extends Relation<S, R> {

    private throughTable: string;

    constructor(sourceModelClass: Constructor<S>, relatedModelClass: Constructor<R>, throughTable: string, columns: string[]) {
        super(sourceModelClass, relatedModelClass, columns);
        this.throughTable = throughTable;
    }

    public createJoinClause(): Join[] {
        return [
            // First join: Source table -> Through table
            {
                type: 'INNER',
                tables: [this.sourceModelClass.tableName, this.throughTable],
                on: [{
                    leftColumn: {
                        column: this.sourceIdentiferColumn, // Foreign key in source table
                        parentTable: this.sourceModelClass.tableName
                    },
                    rightColumn: {
                        column: `${this.throughTable}.${this.sourceModelClass.tableName}_id`,
                        parentTable: this.throughTable
                    }
                }]
            },
            // Second join: Through table -> Related table
            {
                type: 'INNER',
                tables: [this.throughTable, this.relatedModelClass.tableName],
                on: [{
                    leftColumn: {
                        column: `${this.throughTable}.${this.relatedModelClass.tableName}_id`,
                        parentTable: this.throughTable
                    },
                    rightColumn: {
                        column: this.relatedIdentiferColumn, // Primary key in related table
                        parentTable: this.relatedModelClass.tableName
                    }
                }]
            }
        ];
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass);
        return query;
    }
}