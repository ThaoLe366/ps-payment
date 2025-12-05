import { eventBus } from '../events';
import { InvoiceEvents } from '../constant';
import { cancelInvoice, updateInvoice } from './invoice';
export * from './invoice';

eventBus.on(InvoiceEvents.InvoiceCancel, ({ invoice }) => {
  if (null == invoice) {
    console.log('[WARNING]', 'Receiving suspicious message');
    return;
  }
  cancelInvoice(invoice);
});

eventBus.on(InvoiceEvents.InvoiceUpdated, ({ invoice }) => {
  if (null == invoice) {
    console.log('[WARNING]', 'Receiving suspicious message');
    return;
  }
  updateInvoice(invoice);
});
