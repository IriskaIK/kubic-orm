// Tests
import QueryBuilderBase from "@/query-builder/queryBuilderBase";

describe('QueryBuilder', () => {
    test('should generate a valid SELECT query with basic conditions', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .select(['id', 'name'])
            .where({ field: 'age', operator: '>', value: 25 })
            .toSQL();

        expect(query).toBe("SELECT id, name FROM users WHERE age > '25'");
    });

    test('should handle multiple conditions with AND', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .where({ field: 'age', operator: '>', value: 25 })
            .andWhere({ field: 'status', operator: '=', value: 'active' })
            .toSQL();

        expect(query).toBe("SELECT * FROM users WHERE age > '25' AND status = 'active'");
    });

    test('should handle multiple conditions with OR', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .where({ field: 'age', operator: '>', value: 25 })
            .orWhere({ field: 'city', operator: '=', value: 'New York' })
            .toSQL();

        expect(query).toBe("SELECT * FROM users WHERE age > '25' OR city = 'New York'");
    });

    test('should handle nested conditions', () => {
        const query = new QueryBuilderBase({ table: 'orders' })
            .whereNested([
                { field: 'amount', operator: '>', value: 100 },
                { field: 'status', operator: '=', value: 'completed', type: 'OR' },
            ])
            .toSQL();

        expect(query).toBe("SELECT * FROM orders WHERE (amount > '100' OR status = 'completed')");
    });

    test('should handle joins correctly', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .select(['users.id', 'orders.amount'])
            .innerJoin('orders', 'users.id = orders.user_id')
            .where({ field: 'users.id', operator: '=', value: 1 })
            .toSQL();

        expect(query).toBe(
            "SELECT users.id, orders.amount FROM users INNER JOIN orders ON users.id = orders.user_id WHERE users.id = '1'"
        );
    });

    test('should include LIMIT and OFFSET', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .limitTo(10)
            .offsetBy(5)
            .toSQL();

        expect(query).toBe("SELECT * FROM users LIMIT 10 OFFSET 5");
    });

    test('should generate a SELECT DISTINCT query', () => {
        const query = new QueryBuilderBase({table: 'users'})
            .select(['name', 'age'])
            .distinct()
            .toSQL();

        expect(query).toBe("SELECT DISTINCT name, age FROM users")
    });

    test('should work with WHERE conditions and DISTINCT', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .select(['name', 'email'])
            .distinct()
            .where({ field: 'age', operator: '>', value: 30 })
            .toSQL();

        expect(query).toBe("SELECT DISTINCT name, email FROM users WHERE age > '30'");
    });

    test('should handle DISTINCT with JOINs', () => {
        const query = new QueryBuilderBase({ table: 'users' })
            .select(['users.name', 'orders.total'])
            .distinct()
            .innerJoin('orders', 'users.id = orders.user_id')
            .toSQL();

        expect(query).toBe("SELECT DISTINCT users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id");
    });


});

// TODO: Test invalid scenarios(write validator for queryBuilder)
