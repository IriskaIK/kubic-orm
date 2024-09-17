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


interface IUser {
    id : number,
    name : string,
}
class User extends Model<IUser>{
    static get tableName(){
        return "Users"
    }
}


async function some(){
    const u = await User.$query().select(['id', 'name']).execute()
    console.log(u)
}

some()










