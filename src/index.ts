import credentials from "@/configs/credentials.config";
import Connection from "@/database/Connection";
import Model from "@/base-model/baseModel";
import HasOneRelation from "@/relations/hasOne/HasOneRelation";
import Relation from "@/relations/Relation";


const dbConfig = {
    user: credentials.user,
    host: credentials.host,
    database: credentials.database,
    password: credentials.password,
    port: credentials.port,
};

Connection.getInstance(dbConfig);


interface IUser {
    id : number,
    first_name : string,
    shippingAddress_id : number
}
interface IShippingAddress{
    id : number,
    region : string,
    city : string,
    postOffice : string
}

class ShippingAddress extends Model<IShippingAddress>{
    static get tableName(){
        return "shippingAddress"
    }
}

class User extends Model<IUser>{
    static get tableName(){
        return "users"
    }

    static get relations(){
        return {
            shippingAddress : {
                relation : HasOneRelation,
                model : ShippingAddress,
                join : {
                    from : 'users.shippingAddress_id',
                    to : 'shippingAddress.id'
                }
            }
        }
    }
}




async function some(){
    const u = await User.$query().select(['*']).withRelations().execute()
    console.log(u)
}

some()





