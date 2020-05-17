import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, validateRequest } from '@ms-ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '../../../common/src';
import { Order, OrderStatus } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes in seconds.

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
    const { ticketId } = req.body;

        // Find the ticket that the user trying to order in the database.
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) {
            throw new NotFoundError();
        }

        // Make sure that the ticket is not already reserved.
        // Run query to look at all orders, Find an order where the ticket is
        // the ticket we just found above and order status is not cancelled.
        // If we find an order from  that means, ticket is reserved.
        // const existingOrder = await Order.findOne({
        //     ticket: ticket,
        //     status: {
        //         $nin: [ OrderStatus.Cancelled ]
        //     },
        // });

        // if(existingOrder) {
        //     throw new BadRequestError('Ticket is already reserved!');
        // }

        // We have moved above code to Tickets Document as a method called 'isReserved'
        // So that it simplifies the things we do above, where we don't need to write such
        // repetitive code over and over.

        const isReserved = await ticket.isReserved();
        if(isReserved) {
            throw new BadRequestError('Ticket is already reserved!');
        }

        // Calculate expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order an save it to the database.
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
        });
        await order.save();

        // Push an event saying that an order was created.

        res.status(201).send(order);
});

export { router as newOrderRouter };
