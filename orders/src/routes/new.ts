import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ms-ticketing/common';
import { body } from 'express-validator';

const router = express.Router();

router.post('/api/orders',
    requireAuth,
    [
        body('title')
            .not().isEmpty()
            .custom(((input:string) => mongoose.Types.ObjectId.isValid(input)))
            .withMessage('Valid ticket id must be provided.'),
        body('price').isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

    res.send({ });
});

export { router as newOrderRouter };
