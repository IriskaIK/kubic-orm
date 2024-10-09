import Model from "@/base-model/baseModel";
import {Constructor} from "@/types/model.types";
import {Query} from "@/types/query.types";
import {ResultMappingColumnPrototype, ResultMappingModelPrototype} from "@/types/mapper.types";

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



    private static mapData<T extends Model>(resultsKey: string, data: any, instance: T, modelProto : ResultMappingModelPrototype<T, Model>){
        for(const [key, value] of Object.entries(modelProto.columns)) {
            if(value.column == resultsKey){
                Object.assign(instance, {[value.column]: data})
                return;
            }else if(value.alias == resultsKey){
                Object.assign(instance, {[value.alias] : data})
            }
        }
        for(const [key, value] of Object.entries(modelProto.relations)) {
            const s = new modelProto.relations[key].model;
            Object.assign(instance, {[key] : s})
            this.mapData(resultsKey, data, s, value)
        }
    }

    public static mapToInstances<T extends Model>(results : Record<string, any>[], modelProto : ResultMappingModelPrototype<T, Model>){
        let mappedInstances: T[] = [];

        results.forEach((e)=>{
            let instance = new modelProto.model()
            for (const key in e){
                this.mapData(key, e[key], instance, modelProto);
            }
            mappedInstances.push(instance as T)
        })

        return mappedInstances;


    }
}


