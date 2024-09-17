import Model from "@/base-model/baseModel";


class Relation {
    protected relationName : string
    protected relatedModel : typeof Model;
    protected foreignKey : string = '';

    constructor(relationName: string, relatedModel : typeof Model) {
        this.relationName = relationName;
        this.relatedModel = relatedModel;
    }
}

export default Relation;