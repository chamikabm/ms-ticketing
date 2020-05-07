import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(private errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending a built in Error class.
        // https://stackoverflow.com/questions/45042777/how-to-properly-use-object-setprototypeof
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors () {
        return this.errors.map(error => {
            return { message: error.msg, field: error.param }
        });
    }
}