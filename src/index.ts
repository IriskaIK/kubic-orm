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
    shipping_address : ShippingAddress,
}

interface ShippingAddress {
    id: number,
    region: string,
    city: string,
    postOffice: string,
    full_address: string,
}

class ShippingAddress extends Model implements ShippingAddress {
    static get tableName() {
        return "shippingAddress"
    }

    static get columns(){
        return [
            'id',
            'full_address',
            'region_id',
            'city_id',
            'postOffice_id'
        ]
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

    static get columns(){
        return [
            'id',
            'first_name',
            'email',
            'password',
            'last_name',
            'phone',
            'shippingAddress_id',
            'image_id',
            'type',
            'created_at',
            'updated_at'
        ]
    }

}

async function some() {
    const u = await User.$query()
        .select(["id", "first_name"])
        .joinRelation('shipping_address', ((builder)=>{
            builder.select(["full_address"]);
        }))
        .execute();

    console.log(u[0].shipping_address.full_address)
}

some()




