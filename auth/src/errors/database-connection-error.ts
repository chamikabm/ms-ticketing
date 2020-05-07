import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database'
  constructor() {
    super('Error connecting to database');

    // Only because we are extending a built in Error class.
    // https://stackoverflow.com/questions/45042777/how-to-properly-use-object-setprototypeof
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors () {
    return [
      { message : this.reason }
    ];
  }
}