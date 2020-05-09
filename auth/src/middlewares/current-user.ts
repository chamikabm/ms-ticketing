import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string,
    email: string,
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload,
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    // if(!req.session || !req.session.jwt) {  Same as below, ? typescript symbol to check internal property is available or not.
    if(!req.session?.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch (err) {
        console.log('Error :', err)
    }

    next();
};