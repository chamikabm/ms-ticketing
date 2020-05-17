import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {

    // Having {} empty object inside find, instructs mongoose to fetch all data from mongo db.
    const tickets = await Ticket.find({});

    res.send(tickets);
});

export { router as indexTicketRouter }