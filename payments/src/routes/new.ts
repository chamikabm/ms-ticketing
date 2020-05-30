import express, { Request, Response } from 'express';
import {
    NotFoundError, NotAuthorizedError, BadRequestError,
    requireAuth, validateRequest, OrderStatus,
} from '@ms-ticketing/common';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty()
            .withMessage('Token is required'),
        body('orderId').not().isEmpty()
            .withMessage('Order id is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Can`t pay for Cancelled order');
        }

        res.status(200).send({  });
    });

export { router as createChargeRouter };


