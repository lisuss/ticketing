import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { currentUser } from '@lisustickets/common';
import { errorHandler } from '@lisustickets/common';
import { showTicketRouter } from './routes/show';
import { indexTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(indexTicketsRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);
app.use(createTicketRouter);

app.use(errorHandler);

export { app };
