import express from 'express';
import 'express-async-errors'; // Use to handle async error
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json({}));


// Indicates the app is behind a front-facing proxy, and to use
// the X-Forwarded-* headers to determine the connection and the
// IP address of the client. NOTE: X-Forwarded-* headers are easily
// spoofed and the detected IP addresses are unreliable.
// This is a express setting: https://expressjs.com/en/api.html --> Application Settings

// The X-Forwarded-For (XFF) header is a de-facto standard header
// for identifying the originating IP address of a client connecting
// to a web server through an HTTP proxy or a load balancer.
// When traffic is intercepted between clients and servers,
// server access logs contain the IP address of the proxy or load balancer only.
// To see the original IP address of the client, the X-Forwarded-For
// request header is used.
// See More : https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
app.set('trust proxy', true);

// Here we have disabled the cookie encryption with signed: false flag, because
// JWT that we are doing to use already secure and no need to encrypt.
//
// But if we planing to store more sensitive data on cookie we need to encrypt in
// such case.
app.use(cookieSession({
    signed: false, // Disable encryption on cookies.
    secure: true, // Indicates whether the cookie is only to be sent over HTTPS
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);


// Send 404 for all not found routes, 'all' for all type of HTTP methods, GET, POST, DELETE etc.
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
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
