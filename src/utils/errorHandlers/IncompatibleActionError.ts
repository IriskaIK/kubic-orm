import CustomErrorBase from "@/utils/errorHandlers/CustomError";


class IncompatibleActionError extends CustomErrorBase {

    constructor(message: string) {
        super(message, 'INCOMPATIBLE_ACTION');
    }
}

export default IncompatibleActionError;