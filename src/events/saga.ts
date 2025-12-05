import {
  InvoiceEvents,
  PaymentEvents,
  PaymentProcessEvents,
} from '../constant/index';
import { eventBus } from '.';

export class EventControl {
  constructor() {
    eventBus.on(PaymentProcessEvents.InvoiceCreateSuccess, (message) => {
      // Send info to payment about new invoice
      eventBus.emit(PaymentEvents.PaymentCreate, message);
    });
    eventBus.on(PaymentProcessEvents.PaymentCreateFailed, (message) => {
      // Cancel invoice status
      eventBus.emit(InvoiceEvents.InvoiceCancel, message);
    });
    eventBus.on(PaymentProcessEvents.PaymentCreateSuccess, (message) => {});
    eventBus.on(PaymentProcessEvents.InvoicePaymentApplied, (message) => {
      // Update invoice outstanding balance
      eventBus.emit(InvoiceEvents.InvoiceUpdated, message);
    });
  }
}
