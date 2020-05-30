import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    // This will reset the mock counts etc.
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// Without this global thing, you can move these util test classes to a
// separate helper file.
global.signin = (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id ||  mongoose.Types.ObjectId().toHexString(), // Every time we call this, it will generate a new Id.
        email: 'test@test.com',
    };

    // Create JWT
    const token = jwt.sign(payload,  process.env.JWT_KEY!);

    // Build Session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base 64
    const base64Session = Buffer.from(sessionJSON).toString('base64');

    // Returns the string, that's the cookie with the encoded data.
    return [`express:sess=${base64Session}`];
}