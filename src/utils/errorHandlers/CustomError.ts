
class CustomErrorBase extends Error {
    public typeOfError: string;


    constructor(message: string, typeOfError: string) {
        super(message);
        this.name = this.constructor.name;
        this.typeOfError = typeOfError;
        Error.captureStackTrace(this, this.constructor);
    }


}


export default CustomErrorBase;