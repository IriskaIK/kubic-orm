import credentials from "@/configs/credentials.config";
import Connection from "@/database/Connection";
import Model from "@/base-model/baseModel";
import {ManyToManyRelation} from "@/relations/ManyToManyRelation/ManyToManyRelation";
import {RelationalMappings} from "@/types/model.types";
import {Relation} from "@/relations/Relation";
import {BelongsToOneRelation} from "@/relations/BelongsToOne/BelongsToOneRelation";

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
    shippingAddress_id: number,
    shippingAddress : ShippingAddress,
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

    static get relations() : RelationalMappings{
        return {
            'shipping_address' : {
                relation : BelongsToOneRelation,
                model : ShippingAddress,
                join : {
                    from : 'users.shippingAddress_id',
                    to : 'shippingAddress.id',
                }
            }
        }
    }

}

async function some() {
    const u = await User.$query()
        .select(["users.first_name", "users.id", "shippingAddress.full_address", "last_name"])
        .withJoinRelations(['shipping_address'])
        .execute();

    console.log(u)
}

some()




