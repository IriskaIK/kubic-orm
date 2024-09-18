import Connection from "@/database/Connection";
import QueryBuilder from "@/query-builder/queryBuilder";
import {RelationalMappings, Constructor} from "@/types/model.types";


class Model {
    private static query: QueryBuilder<typeof Model>;
    private static connection: Connection;

    static get tableName(): string {
        // TODO: handle error
        throw new Error("Children must implement this method.")
    }

    static get relations() : RelationalMappings{
        return {}
    }

    public static $query<T extends Model>(this: Constructor<T>): QueryBuilder<T> {
        return new QueryBuilder(this);
    }

}

export default Model;