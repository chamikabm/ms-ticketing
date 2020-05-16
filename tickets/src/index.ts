import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw Error('JWT_KEY must be defined.');
    }

    if(!process.env.MONGO_URI) {
        throw Error('MONGO_URI must be defined.');
    }

    try {
        await natsWrapper.connect('ticketing', 'sdfsdfs', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => {
            // Exit by CMD + C etc.
            console.log('SIGINT Received!')
            natsWrapper.client.close();
        });

        process.on('SIGTERM', () => {
            // Restart
            console.log('SIGTERM Received!')
            natsWrapper.client.close();
        });

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
};

start();
