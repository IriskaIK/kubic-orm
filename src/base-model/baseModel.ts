import QueryBuilderBase from "@/query-builder/queryBuilderBase";
import {ConditionOperator} from "@/types/queryTypes";
import Connection from "@/database/Connection";




abstract class Model<T> {
    private static query: QueryBuilderBase;
    private static connection: Connection;

    static get tableName(): string {
        // TODO: handle error
        throw new Error("Children must implement this method.")
    }

    static get relations(){
        return {}
    }

    public static $query(): typeof this {
        this.query = new QueryBuilderBase({table: this.tableName});
        return this;
    }

    public static select(columns: string[]): typeof this {
        this.query.select(columns)
        return this;
    }

    public static where(column: string, operator: ConditionOperator, value: any): typeof this {
        this.query.where({field: column, operator: operator, value: value})
        return this;
    }

    public static andWhere(column: string, operator: ConditionOperator, value: any): typeof this {
        this.query.andWhere({field: column, operator: operator, value: value})
        return this;
    }

    public static orWhere(column: string, operator: ConditionOperator, value: any): typeof this {
        this.query.orWhere({field: column, operator: operator, value: value})
        return this;
    }

    public static limit(limitTo: number): typeof this {
        this.query.limitTo(limitTo);
        return this;
    }

    public static offsetBy(offset: number): typeof this {
        this.query.offsetBy(offset);
        return this;
    }

    public static findAll(): typeof this {
        // TODO: findAll implementation
        return this;
    }


    public static async execute() {
        return (await Connection.getInstance().query(this.query.toSQL())).rows
    }


}

export default Model;