import {Pool, PoolConfig, QueryResult, QueryResultRow} from 'pg';


class Connection{
    private static instance: Connection;
    private pool: Pool;


    private constructor(config : PoolConfig) {
        this.pool = new Pool(config);

    }

    public static getInstance(config : PoolConfig) : Connection {
        if(!Connection.instance){
            Connection.instance = new Connection(config);
        }

        return Connection.instance;
    }

    public async query<T extends QueryResultRow = any>(text: string): Promise<QueryResult<T>> {
        try {
            return await this.pool.query<T>(text);
        } catch (error) {
            // TODO: Handle query error via errorHandler
            console.error('Database query error:', error);
            throw error;
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}

export default Connection;