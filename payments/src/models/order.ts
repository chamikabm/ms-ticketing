import mongoose from 'mongoose';
import { OrderStatus } from '@ms-ticketing/common';

// This plugin used to handle concurrency [OCC - Optimistic Concurrency Control]
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Re exporting this just to simply imports on the app, so that, Order and OrderSatus
// will be import from the same file.
export { OrderStatus };

// An interface that describes the properties
// that are required to creat a new order.
interface OrderAttrs {
    id: string,
    userId: string,
    version: number,
    price: number,
    status: OrderStatus,
}

// An interface that describes the properties
// that a Order Document has.
interface OrderDoc extends mongoose.Document {
    userId: string,
    version: number,
    price: number,
    status: OrderStatus,
}

// An interface that describes the properties
// that a Order Model has.
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc,
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        version: attrs.version,
        price: attrs.price,
        status: attrs.status,
    });
};

// const Order = mongoose.model('Order', orderSchema);
// New need to add '<any, OrderModel>' to bind typescript model to mongoose model.
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

// We create this builder function to get help with typescript when creating
// orders, otherwise mongoose Order model does not have type validations. Having such
// builder allow us to validate the Order attributes through the OrderAttrs interface
// when passing to the `buildOrder` function.
// const buildOrder = (attrs: OrderAttrs) => {
//     return new Order(attrs);
// };

// export { Order, buildOrder };

// Without doing above, we can export Single `Order` model as we normally do
// by using 'orderSchema.statics.build' to attach a function to create orders
// as above, so that we can simply create orders as below.

// Order.build({
//     userId: '',
//     status: ''
// })

export { Order };
