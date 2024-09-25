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
    id: number,
    first_name: string,
    shippingAddress_id: number
}

interface ShippingAddress {
    id: number,
    region: string,
    city: string,
    postOffice: string
}

class ShippingAddress extends Model implements ShippingAddress {
    static get tableName() {
        return "shippingAddress"
    }
}

class User extends Model implements User {
    static get tableName() {
        return "users"
    }

}

async function some() {
    const u = User.$query()
        .select(["id", "orders.id", "users.name"])
        .where('users.age', '>', '30')
        .andWhere('users.name', '=', undefined, 'orders.user_name')
        .limitTo(20)
        .offsetBy(20)
        .innerJoin('orders', 'users.id = orders.user_id')
        .execute();


}

some()




