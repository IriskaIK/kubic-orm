// Tests
import QueryBuilder from "@/query-builder/queryBuilder";
import Model from "@/base-model/baseModel";


// TODO: Rewrite unit tests for QueryBuilder

interface TestModel {
    id: number,
    region: string,
    city: string,
    postOffice: string
}

class TestModel extends Model implements TestModel {
    static get tableName() {
        return "testModel"
    }
}

describe('QueryBuilder', () => {
    test('should generate a valid SELECT query with basic conditions', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id', 'name'])
            .where('age', '>', '25')
            .getSQL()
        expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "age" > "25"`);
    });


    test('should handle alias in SELECT query', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id AS userId', 'name'])
            .getSQL()
        expect(query).toBe(`SELECT "id" AS "userId", "name" FROM "testModel"`);
    });

    test('should handle multiple conditions with AND', () => {
        const query = new QueryBuilder(TestModel)
            .where('age', '>', '25')
            .andWhere('status', '=', 'active')
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > "25" AND "status" = "active"`);
    });

    test('should handle multiple conditions with OR', () => {
        const query = new QueryBuilder(TestModel)
            .where('age', '>', '25')
            .orWhere( 'city', '=', 'New York')
            .getSQL()

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > "25" OR "city" = "New York"`);
    });

    // test('should handle nested conditions', () => {
    //     const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
    //         .whereNested([
    //             {field: 'amount', operator: '>', value: 100},
    //             {field: 'status', operator: '=', value: 'completed', type: 'OR'},
    //         ])
    //         .toSQL();
    //
    //     expect(query).toBe(`SELECT * FROM "testModel" WHERE (amount > '100' OR status = 'completed')`);
    // });
    //

    test('should handle joins correctly', () => {
        const query = new QueryBuilder(TestModel)
            .select(['testModel.id', 'order.amount'])
            .innerJoin('order', "testModel.order_id = order.id")
            .getSQL();

        expect(query).toBe(
            `SELECT "testModel"."id", "order"."amount" FROM "testModel" INNER JOIN "order" ON "testModel"."order_id" = "order"."id"`
        );
    });

    test('should include LIMIT and OFFSET', () => {
        const query = new QueryBuilder(TestModel)
            .limitTo(10)
            .offsetBy(5)
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" LIMIT 10 OFFSET 5`);
    });

    test('should generate a SELECT DISTINCT query', () => {
        const query = new QueryBuilder(TestModel)
            .select(['name', 'age'])
            .distinct()
            .getSQL();

        expect(query).toBe(`SELECT DISTINCT "name", "age" FROM "testModel"`)
    });

    test('should generate a valid SELECT query with findById', () => {
        const query = new QueryBuilder(TestModel)
            .findById(1) // Assuming 'id' is a valid column in the model
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "id" = "1"`);
    });

    test('should generate a valid SELECT query with findByIds', () => {
        const query = new QueryBuilder(TestModel)
            .findByIds([1, 2, 3])
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "id" IN (1, 2, 3)`);
    });

    test('should handle multiple conditions with AND NOT', () => {
        const query = new QueryBuilder(TestModel)
            .where('age', '>', '25')
            .whereNot( 'city', '=', 'New York')
            .getSQL()

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > "25" AND NOT "city" = "New York"`);
    });

    test('should handle multiple conditions with OR NOT', () => {
        const query = new QueryBuilder(TestModel)
            .where('age', '>', '25')
            .orWhereNot( 'city', '=', 'New York')
            .getSQL()

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > "25" OR NOT "city" = "New York"`);
    });


    test('should generate a valid SELECT query with findOne', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id', 'name'])
            .where('status', '=', 'active')
            .findOne()
            .getSQL();

        expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "status" = "active" LIMIT 1`);
    });

    test('should generate a valid SELECT query with WHERE IN clause', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id', 'name'])
            .whereIn('id', [1, 2, 3, 4])
            .getSQL();

        expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "id" IN (1, 2, 3, 4)`);
    });

    test('should generate a valid SELECT query with multiple OR conditions including WHERE IN clause', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id', 'name'])
            .where('age', '>', 25)
            .orWhereIn('id', [1, 2, 3])
            .getSQL();

        expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "age" > "25" OR "id" IN (1, 2, 3)`);
    });

    test('should generate a valid SELECT query with WHERE NOT IN condition', () => {
        const query = new QueryBuilder(TestModel)
            .whereNotIn('id', [1, 2, 3])
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "id" NOT IN (1, 2, 3)`);
    });

    test('should generate a valid SELECT query with OR WHERE NOT IN condition', () => {
        const query = new QueryBuilder(TestModel)
            .select(['id', 'name'])
            .where('age', '>', 25)
            .orWhereNotIn('id', [1, 2, 3])
            .getSQL();

        expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "age" > "25" OR "id" NOT IN (1, 2, 3)`);
    });

    /*
    Test for whereNested:
    test('should handle nested conditions with whereNested', () => {
        const query = new QueryBuilder(TestModel)
            .where('age', '>', '25')
            .whereNested((qb) => {
                qb.where('firstName', '=', 'John')
                    .orWhere('lastName', '=', 'Doe');
            })
            .andWhere('status', '=', 'active')
            .getSQL();

        expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > "25" AND ("firstName" = "John" OR "lastName" = "Doe") AND "status" = "active"`);
    });
    */
});

// TODO: Test invalid scenarios(write validator for queryBuilder)