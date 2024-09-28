import ValidationError from "@/utils/errorHandlers/ValidationError";
import logger from "@/utils/logger/logger";

class QueryBuilderValidator {
    private static validOperators: Set<string> = new Set(['=', '!=', '<', '>', '<=', '>=', 'LIKE']);

    static validateTableName(name: string): void {
        const valid =  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
        if(!valid){
            const error = new ValidationError(`Invalid table name: ${name}`);
            logger.error(error);
            throw error;
        }
    }

    static validateColumnName(name: string): void {
        const valid = /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name);
        if(!valid) {
            const error = new ValidationError(`Invalid column name: ${name}`);
            logger.error(error);
            throw error;
        }
    }

    static validateOperator(operator: string): boolean {
        return this.validOperators.has(operator);
    }

    static validateLimitAndOffsetValue(number: number, operator : string): void {
        if(number < 0){
            const error = new ValidationError(`Invalid number on ${operator} operation: ${number}`);
            logger.error(error);
            throw error;
        }
    }


}
export default QueryBuilderValidator;