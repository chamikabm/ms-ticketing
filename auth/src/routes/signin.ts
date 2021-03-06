import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@ms-ticketing/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

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
    async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser) {
        throw new BadRequestError('Invalid credentials!');
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        throw new BadRequestError('Invalid credentials!');
    }

        // Generate JWT
        const userJwt = jwt.sign({
                id: existingUser.id,
                email: existingUser.email,
            }, process.env.JWT_KEY! // Here ! tells to typescript compiler not to worry about this value being null or undefined.
        );

        // Store it on session object
        // req.session.jwt = userJwt;
        // We can't do live above as Typescript definition file for cookie-session
        // does not have information
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(existingUser);
});

export { router as signinRouter };
