import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import {
  validateRequest,
  NotAuthorizedError,
  requireAuth,
} from '@lisustickets/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title cannot be empty'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be above 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.sendStatus(404);
    }
    if (ticket.orderId) {
      throw new Error('Ticket is already reserved');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title: req.body.title, price: req.body.price });

    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
