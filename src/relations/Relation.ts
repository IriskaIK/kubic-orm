import Model from "@/base-model/baseModel";
import {Constructor, Column, Join} from "@/relations/types";
import QueryBuilder from "@/query-builder/queryBuilder";

export abstract class Relation<S, R extends Model>{
    protected relationName : string = '';

    protected sourceTableName : string = '';
    protected relatedTableName : string = '';

    protected sourceModelClass : Constructor<S>;
    protected relatedModelClass : Constructor<R>;

    protected sourceIdentiferColumn : string = '';
    protected relatedIdentiferColumn : string = '';

    protected toSelectColumns : Column[] = [];


    private addColumn(column : string, table? : string) : void{
        if(table){
            this.toSelectColumns.push({
                column : column,
                parentTable : table
            })
            return;
        }
        this.toSelectColumns.push({
            column : column,
        })
    }

    private parseColumns(columns : string[]) : void{
        if(columns.length === 0 || (columns.length === 1 && columns[0] === '*')){
            this.addColumn('*', this.sourceModelClass.tableName)
            this.addColumn('*', this.relatedModelClass.tableName)
            return;
        }

        columns.forEach((element) =>{
            const [table, column] = element.split('.');
            if(!column){
                this.addColumn(element)
            }else{
                this.addColumn(element, table)
            }
        })

    }


    public abstract createJoinClause() : Join[]
    public abstract createQuery() : QueryBuilder<R>

    constructor(sourceModelClass: Constructor<S>, relatedModelClass : Constructor<R>, columns : string[]){
        this.sourceModelClass = sourceModelClass
        this.relatedModelClass = relatedModelClass
        this.parseColumns(columns);
    }
}
