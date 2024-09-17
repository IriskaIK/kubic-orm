import QueryBuilderBase from "@/query-builder/queryBuilderBase";
import {ConditionOperator} from "@/types/queryTypes";
import Connection from "@/database/Connection";
import Relation from "@/relations/Relation";
import formatJoinStringHelper from "@/utils/helpers/formatJoinString.helper";



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

abstract class Model<T> {
    private static query: QueryBuilderBase;
    private static connection: Connection;

    static get tableName(): string {
        // TODO: handle error
        throw new Error("Children must implement this method.")
    }

    static get relations() : RelationalMappings{
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


    protected static createJoinClause(from: string, to: string, tableName : string){

        this.query.innerJoin(tableName, `${formatJoinStringHelper(from)} = ${formatJoinStringHelper(to)}`)
    }

    protected static mapRelations(){
        for(const key in this.relations){
            if(this.relations.hasOwnProperty(key)){
                const mapping = this.relations[key];
                const tableNameToJoin = mapping.model.tableName
                const from = mapping.join.from;
                const to = mapping.join.to;
                this.createJoinClause(from, to, tableNameToJoin)
            }
        }

    }

    public static withRelations() : typeof this{
        this.mapRelations()
        return this;
    }




    public static async execute() {
        const result = (await Connection.getInstance().query(this.query.toSQL())).rows
        await Connection.getInstance().close()
        return result;
    }


}

export default Model;