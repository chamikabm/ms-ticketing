import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler  = (err: Error, req: Request,
                              res: Response, next: NextFunction) => {
    console.log('Something went wrong. ', err);

    if ( err instanceof CustomError ) {
        console.log('Handling this error as a custom error.');
        res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    res.status(500).send({
        errors:[ {
            message: 'Something went wrong',
        }]
    });
};
