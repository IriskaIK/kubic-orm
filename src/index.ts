import credentials from "@/configs/credentials.config";
import QueryBuilderBase from "@/query-builder/queryBuilderBase";
const dbConfig = {
    user: credentials.user,
    host: credentials.host,
    database: credentials.database,
    password: credentials.password,
    port: credentials.port,
};

const queryBuilder = new QueryBuilderBase({table : "user"})


queryBuilder.select(['*'])
    .where({field : "Name", operator : "=", value : "oleg"})
    .andWhere({field : "Age", operator : ">", value : 13})
    .join('INNER', 'Location', 'user.location_id = location.id')
    .limitTo(20)
    .offsetBy(100)

// queryBuilder.insert({"name" : "Oleg", "age" : 31})
console.log(queryBuilder.toSQL())


