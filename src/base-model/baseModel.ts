import Connection from "@/database/Connection";
import {QueryBuilder} from "@/query-builder/queryBuilder";
import {RelationalMappings, Constructor} from "@/types/model.types";

/**
 * The base class for models. All models in the application should extend this class.
 * It provides core functionality such as querying the database and managing relationships.
 */
export class Model {

    /**
     * The QueryBuilder instance used to build database queries for the model.
     * @private
     */
    private static query: QueryBuilder<typeof Model>;

    /**
     * The Connection instance that handles the database connection.
     * @private
     */
    private static connection: Connection;

    /**
     * Returns the table name for the model. This method must be implemented by any child class.
     * @throws {Error} Throws an error if not implemented by the child class.
     * @returns {string} The table name.
     */
    static get tableName(): string {
        // TODO: handle error
        throw new Error("Children must implement this method.")
    }

    /**
     * Returns the relational mappings for the model. By default, it returns an empty object.
     * Child classes can override this to define relationships between models.
     * @returns {RelationalMappings} An object defining the relationships for the model.
     */
    static get relations(): RelationalMappings {
        return {}
    }

    /**
     * Returns a QueryBuilder instance for the current model. This allows for building and executing
     * database queries specific to the model.
     *
     * @template T The type of the model class.
     * @param this The model class itself.
     * @returns {QueryBuilder<T>} A new instance of the QueryBuilder for the model.
     */
    public static $query<T extends Model>(this: Constructor<T>): QueryBuilder<T> {
        return new QueryBuilder(this);
    }

}
