import Relation from "@/relations/Relation";
import Model from "@/base-model/baseModel";

class BelongsToOneRelation extends Relation{
    constructor(relationName: string, relatedModel : typeof Model) {
        super(relationName, relatedModel);
    }
    setForeignKeyColumn(column : string){
        this.foreignKey = column;
    }
}