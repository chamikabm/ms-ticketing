import express, { Request, Response } from 'express';
import {
    requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError,
} from '@ms-ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

// This is same as importing the nats-wrapper.
// jest.mock('../../nats-wrapper');
// Instead of doing this on each file where it uses the nats-wrapper, we can
// put this into `test` setup.ts tile.

const router = express.Router();

router.put('/api/tickets/:id',
    requireAuth, [
        body('title').not().isEmpty()
            .withMessage('Title is required'),
        body('price').isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ], validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if(!ticket) {
            throw new NotFoundError();
        }

        if(ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if(ticket.orderId) {
            throw new BadRequestError('Can not edit a reserved ticket!');
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.id,
        });

        res.send(ticket);
    });

export { router as updateTicketRouter };


