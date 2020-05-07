import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email Must be Valid!'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters.')
], (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Invalid error or password.');
        // error.reasons = errors.array();
        throw errors;
    }

    const { email, password } = req.body;
    console.log('Creating user...');

    res.send({});
});

export { router as signupRouter };
