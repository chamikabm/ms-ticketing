import express from 'express';
import 'express-async-errors'; // Use to handle async error
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler, currentUser } from '@ms-ticketing/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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
    // Disable encryption on cookies.
    signed: false,

    // Indicates whether the cookie is only to be sent over HTTPS
    // Also if true in node test env, we won't be able to test cookie in the test cases
    // Hence we disable setting cookie only on HTTPS, when in test env.
    secure: process.env.NODE_ENV !== 'test',
}));
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// Send 404 for all not found routes, 'all' for all type of HTTP methods, GET, POST, DELETE etc.
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };


