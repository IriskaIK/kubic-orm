import CustomErrorBase from "@/utils/errorHandlers/CustomError";


class ValidationError extends CustomErrorBase {

    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
    }
}