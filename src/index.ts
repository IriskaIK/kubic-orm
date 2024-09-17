import credentials from "@/configs/credentials.config";
import Connection from "@/database/Connection";
import Model from "@/base-model/baseModel";
import HasOneRelation from "@/relations/hasOne/HasOneRelation";


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
interface ShippingAddress{
    id : number,
    region : string,
    city : string,
    postOffice : string
}

class ShippingAddress extends Model implements ShippingAddress{
    static get tableName(){
        return "shippingAddress"
    }
}

class User extends Model{
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
    const u = await User.$query().select(["*"]).withRelations().execute();
    console.log(u)
}

some()




