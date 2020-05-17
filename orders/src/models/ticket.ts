import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// An interface that describes the properties
// that are required to creat a new ticket.
interface TicketAttrs {
    title: string,
    price: number,
}

// An interface that describes the properties
// that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    isReserved(): Promise<boolean>,
}

// An interface that describes the properties
// that a Ticket Model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc,
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

// This methods applicable to Model will be added to "statics" object
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

// This methods applicable to Document will be added to "method" object
// It is mandatory to use function key word instead of the arrow functions.
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved'
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $nin: [ OrderStatus.Cancelled ]
        },
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
