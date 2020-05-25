import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price, version } = data;
        // const ticket = await Ticket.findById(id);
        // Since we introduced new version property we can't use above query
        // instead we have to use the following query;
        // const ticket = await Ticket.findOne({
        //     _id: id,
        //     version: version - 1,
        // });
        // Since above query is bit ugly we attached it to the Ticket model as below.
        const ticket = await Ticket.findByEvent(data);

        if(!ticket) {
            throw Error('Ticket not found!');
        }

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}