import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {

    // Having {} empty object inside find, instructs mongoose to fetch all data from mongo db.
    // const tickets = await Ticket.find({});

    // Fetch all tickets which are not associated with any orders.
    const tickets = await Ticket.find({
        orderId: undefined,
    });

    res.send(tickets);
});

export { router as indexTicketRouter }