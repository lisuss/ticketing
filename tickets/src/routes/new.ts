import express, { Request, Response } from 'express';
import {
  requireAuth,
  currentUser,
  validateRequest,
} from '@lisustickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title cannot be empty'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be above 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    if (!req.currentUser) {
      throw new Error('Current user is not defined');
    }

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser.id,
    });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
