// Tests

import Model from "@/base-model/baseModel";
import QueryBuilder from "@/query-builder/queryBuilder";
import {Join} from "@/types/query.types";
import {BelongsToOneRelation} from "@/relations/BelongsToOne/BelongsToOneRelation";
import {ManyToManyRelation} from "@/relations/ManyToManyRelation/ManyToManyRelation";
import {HasManyRelation} from "@/relations/HasManyRelations/HasManyRealtions";

// Mock model classes
class SourceModel extends Model {
    static get tableName() {
        return "source_table";
    }

    static get relations() {
        return {
            'Test_BelongsToOneRelation': {
                relation: BelongsToOneRelation,
                model: RelatedModel,
                join: {
                    from: 'source_table.related_table_id',
                    to: 'related_table.id',
                }
            },
            'Test_HasManyRelations': {
                relation: HasManyRelation,
                model: RelatedModel,
                join: {
                    from: 'source_table.id',
                    to: 'related_table.source_table_id'
                }
            },
            'Test_ManyToManyRelation': {
                relation: ManyToManyRelation,
                model: RelatedModel,
                join: {
                    from: 'source_table.id',
                    to: 'related_table.id',
                    through: {
                        from: 'source_related.source_id',
                        to: 'source_related.related_id',
                        tableName: 'source_related'
                    }
                }
            }
        }
    }

}

class RelatedModel extends Model {
    static get tableName() {
        return "related_table";
    }
}

describe('Relations', () => {
    test("should handle BelongsToOneRelation", () => {
        const relation = new BelongsToOneRelation(SourceModel, RelatedModel, [], 'Test_BelongsToOneRelation')
        const joinClause = relation.createJoinClause()
        expect(joinClause).toStrictEqual([{
            type: "LEFT",
            tables: {
                sourceTable: "source_table",
                relatedTable: "related_table"
            },
            on: {
                leftColumn: {
                    column: "related_table_id",
                    parentTable: "source_table"
                },
                rightColumn: {
                    column: "id",
                    parentTable: "related_table"
                }
            }
        }])
    });

    test("should handle HasManyRelations", () => {
        const relation = new HasManyRelation(SourceModel, RelatedModel, [], 'Test_HasManyRelations')
        const joinClause = relation.createJoinClause()
        expect(joinClause).toStrictEqual([{
            type: "INNER",
            tables: {
                sourceTable: "source_table",
                relatedTable: "related_table"
            },
            on: {
                leftColumn: {
                    column: "id",
                    parentTable: "source_table"
                },
                rightColumn: {
                    column: "source_table_id",
                    parentTable: "related_table"
                }
            }
        }])
    })

    test("should handle ManyToManyRelation", () => {
        const relation = new ManyToManyRelation(SourceModel, RelatedModel, [], 'Test_ManyToManyRelation')
        const joinClause = relation.createJoinClause()
        expect(joinClause).toStrictEqual([
            {
                type : "INNER",
                tables: {
                    sourceTable: "source_table",
                    relatedTable: "source_related"
                },
                on : {
                    leftColumn: {
                        column: "id",
                        parentTable: "source_table"
                    },
                    rightColumn: {
                        column: 'source_id',
                        parentTable: 'source_related'
                    }
                }
            },
            {
                type: "INNER",
                tables: {
                    sourceTable: "source_related",
                    relatedTable: "related_table"
                },
                on: {
                    leftColumn: {
                        column: "related_id",
                        parentTable: "source_related"
                    },
                    rightColumn: {
                        column: "id",
                        parentTable: "related_table"
                    }
                }
            }

        ])
    })
})

