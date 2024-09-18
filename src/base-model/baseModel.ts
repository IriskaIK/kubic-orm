import Connection from "@/database/Connection";
import Relation from "@/relations/Relation";
import QueryBuilder from "@/query-builder/queryBuilder";



interface RelationMapping {
    relation : typeof Relation,
    model : typeof Model,
    join : {
        from : string,
        to : string,
        through? : string
    }
}

interface RelationalMappings {
    [key : string] : RelationMapping
}

class Model {
    private static query: QueryBuilder;
    private static connection: Connection;

    static get tableName(): string {
        // TODO: handle error
        throw new Error("Children must implement this method.")
    }

    static get relations() : RelationalMappings{
        return {}
    }

    public static $query(): QueryBuilder {
        this.query = new QueryBuilder({table: this.tableName, model : this});
        return this.query;
    }

}

export default Model;