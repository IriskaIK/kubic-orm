import {config} from "dotenv";
import * as process from "node:process";
config()

interface Credentials {
    port: number | undefined;
    database: string | undefined;
    user: string | undefined;
    password: string | undefined;
    host : string | undefined;
}

const credentials : Credentials  = {
    port : (process.env.DB_PORT ? +process.env.DB_PORT : undefined),
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST
}
export default credentials;