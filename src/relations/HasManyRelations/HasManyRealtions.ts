import {Relation} from "@/relations/Relation";
import Model from "@/base-model/baseModel";
import {Constructor, Join} from "@/relations/types";
import QueryBuilder from "@/query-builder/queryBuilder";


export class HasManyRelation<S, R extends Model> extends Relation<S, R>{

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[]) {
        super(sourceModelClass, relatedModelClass, columns);
    }

    public createJoinClause(): Join[] {
        return []
    }

    public createQuery(): QueryBuilder<R> {
        const query = new QueryBuilder(this.relatedModelClass)
        return query;
    }

}