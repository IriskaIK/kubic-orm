import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/types/query.types";
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
                tables : {
                    sourceTable : this.sourceModelClass.tableName,
                    relatedTable : this.throughTable
                },
                on: {
                    leftColumn: {
                        column: this.sourceIdentiferColumn, // Foreign key in source table
                        parentTable: this.sourceModelClass.tableName
                    },
                    rightColumn: {
                        column: this.sourceModelClass.relations[this.relationName].join.from,
                        // column: `${this.throughTable}.${this.sourceModelClass.tableName}_id`,
                        // parentTable: this.throughTable
                    }
                }
            },
            {
                type: 'INNER',
                tables : {
                  sourceTable : this.throughTable,
                  relatedTable:  this.relatedModelClass.tableName
                },
                on: {
                    leftColumn: {
                        column : this.sourceModelClass.relations[this.relationName].join.to
                        // column: `${this.throughTable}.${this.relatedModelClass.tableName}_id`,
                        // parentTable: this.throughTable
                    },
                    rightColumn: {
                        column: this.relatedIdentiferColumn, // Primary key in related table
                        parentTable: this.relatedModelClass.tableName
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