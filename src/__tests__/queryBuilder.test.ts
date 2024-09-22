// Tests
import QueryBuilder from "@/query-builder/queryBuilder";
import Model from "@/base-model/baseModel";


// TODO: Rewrite unit tests for QueryBuilder

// interface TestModel {
//     id: number,
//     region: string,
//     city: string,
//     postOffice: string
// }
//
// class TestRelationModel extends Model {
//     static get tableName() {
//         return "testRelationModel";
//     }
// }
//
//
// class TestModel extends Model implements TestModel {
//     static get tableName() {
//         return "testModel"
//     }
//
//     static get relations() {
//         return {
//             testRelation: {
//                 relation: HasOneRelation,
//                 model: TestRelationModel,
//                 join: {
//                     from: 'testModel.fk_id',
//                     to: 'testRelationModel.id'
//                 }
//             }
//
//         }
//     }
// }
//
// describe('QueryBuilder', () => {
//     test('should generate a valid SELECT query with basic conditions', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .select(['id', 'name'])
//             .where({field: 'age', operator: '>', value: 25})
//             .toSQL();
//
//         expect(query).toBe(`SELECT "id", "name" FROM "testModel" WHERE "age" > '25'`);
//     });
//
//     test('should handle multiple conditions with AND', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .where({field: 'age', operator: '>', value: 25})
//             .andWhere({field: 'status', operator: '=', value: 'active'})
//             .toSQL();
//
//         expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > '25' AND "status" = 'active'`);
//     });
//
//     test('should handle multiple conditions with OR', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .where({field: 'age', operator: '>', value: 25})
//             .orWhere({field: 'city', operator: '=', value: 'New York'})
//             .toSQL();
//
//         expect(query).toBe(`SELECT * FROM "testModel" WHERE "age" > '25' OR "city" = 'New York'`);
//     });
//
//     test('should handle nested conditions', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .whereNested([
//                 {field: 'amount', operator: '>', value: 100},
//                 {field: 'status', operator: '=', value: 'completed', type: 'OR'},
//             ])
//             .toSQL();
//
//         expect(query).toBe(`SELECT * FROM "testModel" WHERE (amount > '100' OR status = 'completed')`);
//     });
//
//     test('should handle joins correctly', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .select(['testModel.id', 'testRelationModel.amount'])
//             .withRelations()
//             .toSQL();
//
//         expect(query).toBe(
//             `SELECT "testModel"."id", "testRelationModel"."amount" FROM "testModel" INNER JOIN "testRelationModel" ON "testModel"."fk_id" = "testRelationModel"."id"`
//         );
//     });
//
//     test('should include LIMIT and OFFSET', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .limitTo(10)
//             .offsetBy(5)
//             .toSQL();
//
//         expect(query).toBe(`SELECT * FROM "testModel" LIMIT 10 OFFSET 5`);
//     });
//
//     test('should generate a SELECT DISTINCT query', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .select(['name', 'age'])
//             .distinct()
//             .toSQL();
//
//         expect(query).toBe(`SELECT DISTINCT "name", "age" FROM "testModel"`)
//     });
//
//     test('should work with WHERE conditions and DISTINCT', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .select(['name', 'email'])
//             .distinct()
//             .where({field: 'age', operator: '>', value: 30})
//             .toSQL();
//
//         expect(query).toBe(`SELECT DISTINCT "name", "email" FROM "testModel" WHERE "age" > '30'`);
//     });
//
//
//     test('should handle DISTINCT with JOINs', () => {
//         const query = new QueryBuilder({tableName: 'testModel', model: TestModel})
//             .select(['testModel.name', 'testRelationModel.total'])
//             .distinct()
//             .withRelations()
//             .toSQL();
//
//         expect(query).toBe(`SELECT DISTINCT "testModel"."name", "testRelationModel"."total" FROM "testModel" INNER JOIN "testRelationModel" ON "testModel"."fk_id" = "testRelationModel"."id"`);
//     });
//
//
// });

// TODO: Test invalid scenarios(write validator for queryBuilder)
