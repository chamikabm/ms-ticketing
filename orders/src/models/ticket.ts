import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// This plugin used to handle concurrency [OCC - Optimistic Concurrency Control]
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to creat a new ticket.
interface TicketAttrs {
    id: string,
    version: number,
    title: string,
    price: number,
}

// An interface that describes the properties
// that a Ticket Document has.
export interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    version: number,
    isReserved(): Promise<boolean>,
}

// An interface that describes the properties
// that a Ticket Model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc,
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>, // This is not the ideal name, but we try to find record for given id and version by a emitted event.
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

// Tell mongoose to use the version as 'version' instead of default '_v' property.
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// This methods applicable to Model will be added to "statics" object
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        ...attrs,
        _id: attrs.id,
    });
};
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
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
