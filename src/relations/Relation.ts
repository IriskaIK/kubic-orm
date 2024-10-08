import Model from "@/base-model/baseModel";
import { Column, Join} from "@/types/query.types";
import {Constructor} from "@/types/model.types";
import QueryBuilder from "@/query-builder/queryBuilder";

export class Relation<S extends Model, R extends Model>{
    protected relationName : string = '';

    protected sourceTableName : string = '';
    protected relatedTableName : string = '';

    protected sourceModelClass : Constructor<S>;
    protected relatedModelClass : Constructor<R>;

    protected sourceIdentifierColumn : Column;
    protected relatedIdentifierColumn : Column;

    protected toSelectColumns : Column[] = [{
        column : "*",
        parentTable : this.relatedTableName
    }];


    // private addColumn(column : string, table? : string) : void{
    //     if(table){
    //         this.toSelectColumns.push({
    //             column : column,
    //             parentTable : table
    //         })
    //         return;
    //     }
    //     this.toSelectColumns.push({
    //         column : column,
    //     })
    // }
    //
    // private parseColumns(columns : string[]) : void{
    //     if(columns.length === 0 || (columns.length === 1 && columns[0] === '*')){
    //         this.addColumn('*', this.sourceModelClass.tableName)
    //         this.addColumn('*', this.relatedModelClass.tableName)
    //         return;
    //     }
    //
    //     columns.forEach((element) =>{
    //         const [table, column] = element.split('.');
    //         if(!column){
    //             this.addColumn(element)
    //         }else{
    //             this.addColumn(element, table)
    //         }
    //     })
    //
    // }

    protected parseColumn(column : string) : Column{
        if(column.includes('.')){
            const [table, col] = column.split('.')
            return {
                parentTable : table,
                column : col
            }
        }
        return {
            column : column
        }
    }


    public createJoinClause() : Join[]{
        throw new Error('createJoinClause must be implemented by child')
    }
    public createQuery() : QueryBuilder<R>{
        throw new Error('createQuery must be implemented by child')
    }

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[], relationName : string) {
        this.sourceModelClass = sourceModelClass
        this.relatedModelClass = relatedModelClass

        this.sourceTableName = sourceModelClass.tableName
        this.relatedTableName = relatedModelClass.tableName

        this.relationName = relationName

        this.relatedIdentifierColumn = this.parseColumn(sourceModelClass.relations[this.relationName].join.to)
        this.sourceIdentifierColumn = this.parseColumn(sourceModelClass.relations[this.relationName].join.from)

        // this.parseColumns(columns);
    }
}
