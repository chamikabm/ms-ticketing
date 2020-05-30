import mongoose from 'mongoose';
import { OrderStatus } from '@ms-ticketing/common';

// Re exporting this just to simply imports on the app, so that, Order and OrderSatus
// will be import from the same file.
export { OrderStatus };

// An interface that describes the properties
// that are required to creat a new order.
interface PaymentAttrs {
    orderId: string,
    stripeId: string,
}

// An interface that describes the properties
// that a Payment Document has.
interface PaymentDoc extends mongoose.Document {
    orderId: string,
    stripeId: string,
}

// An interface that describes the properties
// that a Payment Model has.
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc,
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

// const Payment = mongoose.model('Payment', paymentSchema);
// New need to add '<any, PaymentModel>' to bind typescript model to mongoose model.
const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

// We create this builder function to get help with typescript when creating
// payments, otherwise mongoose Payment model does not have type validations. Having such
// builder allow us to validate the Payment attributes through the PaymentAttrs interface
// when passing to the `buildPayment` function.
// const buildPayment = (attrs: PaymentAttrs) => {
//     return new Payment(attrs);
// };

// export { Payment, buildPayment };

// Without doing above, we can export Single `Payment` model as we normally do
// by using 'paymentSchema.statics.build' to attach a function to create payments
// as above, so that we can simply create payments as below.

// Payment.build({
//     userId: '',
//     status: ''
// })

export { Payment };
