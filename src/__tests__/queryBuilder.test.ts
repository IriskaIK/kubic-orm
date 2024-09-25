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


});

// TODO: Test invalid scenarios(write validator for queryBuilder)
