import {
  Invoice,
  Payment,
  PaymentStatus,
  Receipt,
  ReceiptItem,
} from '../types';
import {
  generatePaymentId,
  generateReceiptId,
  generateUnknownPaymentId,
  roundedMoney,
} from '../utils';
import { dbPayment, dbPaymentInvoice, dbReceipt } from './payment.db';
import { PaymentDTO, paymentDTOSchema } from './payment.type';
import { eventBus } from '../events/index';
import { PaymentProcessEvents } from '../constant';
/**
 * Init invoice info
 * @param invoice
 */
export const initPayment = (invoice: Invoice) => {
  try {
    dbPaymentInvoice.save(invoice);
    eventBus.emit(PaymentProcessEvents.PaymentCreateFailed, { invoice });
    console.log('[INFO]', 'Init invoice in payment service successfully');
  } catch (error) {
    console.log('[ERROR]', 'Can not init invoice info');
    eventBus.emit(PaymentProcessEvents.PaymentCreateFailed, { invoice });
  }
};

/**
 * This function saves payment info and update remaining balance to Invoice service
 * @param paymentInfo
 * @returns
 */
export const paymentProcess = (paymentInfo: PaymentDTO): Receipt | null => {
  // Validate input
  const { error } = paymentDTOSchema.validate(paymentInfo);
  if (error) {
    console.error(`[ERROR] Validation failed: `, error.message);
    return null;
  }

  // Validate payment context Info
  // Validate invoiceID
  const invoice = dbPaymentInvoice.findById(paymentInfo.invoiceNumber);
  if (invoice == null) {
    console.error(`[WARNING] Invoice not found`);

    return null;
  }
  // Validate invoice status
  if (
    PaymentStatus.Cancel == invoice.status ||
    PaymentStatus.Done == invoice.status
  ) {
    console.log('[WARNING] This invoice is finish. Can not process more');
    return null;
  }

  // Save payment info
  const paymentId = generatePaymentId();
  const payment: Payment = {
    id: paymentId,
    invoiceId: paymentInfo.invoiceNumber,
    paymentMethod: paymentInfo.method,
    amount: paymentInfo.amount,
    paymentDate: new Date(),
    referenceNumber: paymentId,
  };
  dbPayment.save(payment);
  const newOutStandingAmount = roundedMoney(
    invoice.outstandingAmount - payment.amount
  );

  // Negative amount will send back to customer (as Cash back)
  if (newOutStandingAmount <= 0) {
    invoice.status = PaymentStatus.Done;
  }
  invoice.outstandingAmount = newOutStandingAmount;
  dbPaymentInvoice.updateById(invoice);

  // Receipt will be generated correspondingly with payment
  const receiptId = generateReceiptId();
  const receipt: Receipt = {
    id: receiptId,
    paymentId: paymentId,
    receiptNumber: receiptId,
    totalPaid: roundedMoney(invoice.totalAmount - invoice.outstandingAmount),
    remainingBalance: invoice.outstandingAmount,
    items: invoice.items as ReceiptItem[],
    total: invoice.totalAmount,
  };

  dbReceipt.save(receipt);
  eventBus.emit(PaymentProcessEvents.InvoicePaymentApplied, { invoice });
  return receipt;
};

export const getPaymentInfo = (id: string) => {
  return dbPayment.findById(id);
};

export const getReceiptInfo = (id: string) => {
  return dbReceipt.findById(id);
};

export const getPaymentInvoiceById = (id: string): Invoice | null => {
  return dbPaymentInvoice.findById(id);
};
