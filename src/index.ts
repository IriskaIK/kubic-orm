import credentials from "@/configs/credentials.config";
import Connection from "@/database/Connection";
import Model from "@/base-model/baseModel";

const dbConfig = {
    user: credentials.user,
    host: credentials.host,
    database: credentials.database,
    password: credentials.password,
    port: credentials.port,
};

Connection.getInstance(dbConfig);


interface User {
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

class User extends Model implements User{
    static get tableName(){
        return "users"
    }

}

async function some(){
    const u = await User.$query().select(["*"]).withRelations().execute();


    const k = await User.$query().select(["*"]).execute()

    console.log(u)

    console.log("------------------")

    console.log(k)
}

some()




