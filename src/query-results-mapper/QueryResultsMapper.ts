import Model from "@/base-model/baseModel";
import {Constructor} from "@/types/model.types";
import {Query} from "@/types/query.types";
import {ResultMappingColumnPrototype} from "@/types/mapper.types";

export class QueryResultsMapper {

    private static mapDataToInstance<T extends Model>(key: string, data: any, instance: T) {
        Object.assign(instance, {[key]: data})
    }


    public static mapResultsToModelInstances<T extends Model>(results: Record<string, any>[], modelClass: Constructor<T>, relations: Record<string, Query<Model>>, modelColumnPrototype: ResultMappingColumnPrototype): T[] {
        let mappedInstances: T[] = [];
        results.forEach((e) => {
            let instance = new modelClass()
            for (const key in e) {
                this.mapDataToInstance(key, e[key], instance)
            }
            mappedInstances.push(instance)
        })
        return mappedInstances;
    }
}


