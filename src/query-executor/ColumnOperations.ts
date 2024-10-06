import {Column} from "@/types/query.types";


export class ColumnOperations {
    protected getColumnSQLString(column: Column) {
        if(column.column == '*'){
            return `*`
        }
        return `"${column.parentTable ? column.parentTable + '"."' : ''}${column.column}"${column.alias ? ` AS "${column.alias}"` : ""}`
    }
}