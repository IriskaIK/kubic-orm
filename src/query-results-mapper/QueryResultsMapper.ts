import Model from "@/base-model/baseModel";
import {Constructor} from "@/types/model.types";
import {Query} from "@/types/query.types";
import {ResultMappingColumnPrototype} from "@/types/mapper.types";

export class QueryResultsMapper {

    private static mapDataToInstance<T extends Model>(resultsKey: string, data: any, instance: T, modelColumnPrototype: ResultMappingColumnPrototype, modelClass : Constructor<T>) {
        for (const [key, value] of Object.entries(modelColumnPrototype)) {
            if(value.some(obj => obj.column == resultsKey)){
                if(key == 'origin'){
                    Object.assign(instance, {[resultsKey]: data})
                    return;
                }
                if(instance.hasOwnProperty(key)){
                    Object.assign(instance[key], data);
                    return;
                }
                const s = new modelClass.relations[key].model;
                Object.assign(s, {[resultsKey] : data})
                Object.assign(instance, {[key] : s})
            }
        }
        // Object.assign(instance, {[resultsKey]: data})
    }


    public static mapResultsToModelInstances<T extends Model>(results: Record<string, any>[], modelClass: Constructor<T>, relations: Record<string, Query<Model>>, modelColumnPrototype: ResultMappingColumnPrototype): T[] {
        let mappedInstances: T[] = [];
        results.forEach((e) => {
            let instance = new modelClass()
            for (const key in e) {
                this.mapDataToInstance(key, e[key], instance, modelColumnPrototype, modelClass)
            }
            mappedInstances.push(instance)
        })
        return mappedInstances;
    }
}


