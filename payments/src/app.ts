import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser } from '@lisustickets/common';
import { errorHandler } from '@lisustickets/common';
import { createChargeRouter } from './routes/new';

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
app.use(createChargeRouter);

app.use(errorHandler);

export { app };
