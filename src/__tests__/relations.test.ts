import {Model} from "@/base-model/baseModel";
import {QueryBuilder} from "@/query-builder/queryBuilder";
import {Join} from "@/types/query.types";
import {BelongsToOneRelation} from "@/relations/BelongsToOne/BelongsToOneRelation";
import {ManyToManyRelation} from "@/relations/ManyToManyRelation/ManyToManyRelation";
import {join} from "typedoc/dist/lib/output/themes/lib";

// Mock model classes
class SourceModel extends Model {
    static get tableName() {
        return "source_table";
    }

    static get relations() {
        return {
            'relation_BelongsToOneRelation' : {
                relation : BelongsToOneRelation,
                model : RelatedModel,
                join : {
                    from : 'source_table.id',
                    to : 'related_table.source_table_id',
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

describe("Relations", ()=>{
    test("", ()=>{
        const relation = new BelongsToOneRelation(SourceModel, RelatedModel, [], 'relation_BelongsToOneRelation')
        const joinClause = relation.createJoinClause()
        // TODO: Write join
        expect(joinClause).toBe(`INNER JOIN "related_table" ON "source_table"."id" = "related_table"."source_id"`)
    })
})

