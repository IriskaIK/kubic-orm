import {Column, Query} from "@/types/query.types";
import Model from "@/base-model/baseModel";
import {ColumnOperations} from "@/query-executor/ColumnOperations";


export class ColumnMapper <T extends Model> extends ColumnOperations{
    private readonly query : Query<T>;
    private readonly allTableColumns : string[];
    private readonly tableName : string;
    private readonly selectedColumns : Column[];

    constructor(query : Query<T>) {
        super();
        this.query = query;
        this.allTableColumns = query.model.columns;
        this.tableName = query.table;
        this.selectedColumns = query.columns;
    }

    private selectAllColumns(tableName : string, columnsOfTable : string[]) : string[]{
        let columnsArray : string[] = [];
        columnsOfTable.forEach((column)=>{
            columnsArray.push(`"${tableName}"."${column}"`)
        })
        return columnsArray
    }

    private assignColumnToTable(column : Column, tableName : string){
        if(!column.parentTable){
            column.parentTable = tableName
        }
        return column
    }


    public groupColumns() : string[]{
        let columnsArray: string[] = []
        if(this.selectedColumns.length === 0){
            return this.selectAllColumns(this.tableName, this.allTableColumns)
        }

        this.selectedColumns.forEach((column) => {
            if(column.column == '*'){
                columnsArray = columnsArray.concat(this.selectAllColumns(this.tableName, this.allTableColumns))
            }else{
                columnsArray.push(this.getColumnSQLString(this.assignColumnToTable(column, this.tableName)))
            }
        })

        return columnsArray
    }


}