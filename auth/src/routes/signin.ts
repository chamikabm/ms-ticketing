import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signin', [
        body('email')
            .isEmail()
            .withMessage('Email Must be Valid!'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must provide a password.')
    ],
    validateRequest,
    (req: Request, res: Response) => {
    res.send('Hi there!')
});

export { router as signinRouter };
