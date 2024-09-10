import Connection from "@/database/Connection";
import credentials from "@/configs/credentials.config";

const dbConfig = {
    user: credentials.user,
    host: credentials.host,
    database: credentials.database,
    password: credentials.password,
    port: credentials.port,
};

const db = Connection.getInstance(dbConfig);
