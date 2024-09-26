import {Model} from "@/base-model/baseModel";
import {QueryBuilder} from "@/query-builder/queryBuilder";
import {Join} from "@/types/query.types";

// Mock model classes
class SourceModel extends Model {
    static get tableName() {
        return "source_table";
    }
}

class RelatedModel extends Model {
    static get tableName() {
        return "related_table";
    }
}
