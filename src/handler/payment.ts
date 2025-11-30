import { dbInvoice, dbPayment, dbReceive } from '../db';
import { Payment, PaymentStatus, Receipt, ReceiptItem } from '../types';
import { generatePaymentId, generateReceiptId, roundedMoney } from '../utils';
import { PaymentDTO, paymentDTOSchema } from './payment.type';

export const paymentProcess = (paymentInfo: PaymentDTO): Receipt | null => {
  // Validate input
  const { error } = paymentDTOSchema.validate(paymentInfo);
  if (error) {
    console.error(`[ERROR] Validation failed: `, error.message);
    return null;
  }

  // Validate payment context Info
  // Validate invoiceID
  const invoice = dbInvoice.findById(paymentInfo.invoiceNumber);
  if (invoice == null) {
    console.error(`[ERROR] Invoice invalid`);
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
  dbInvoice.updateById(invoice);

  // Receipt will be generated correspondingly with payment
  const receiptId = generateReceiptId();
  const receipt: Receipt = {
    id: receiptId,
    paymentId: paymentId,
    receiptNumber: receiptId,
    totalPaid: roundedMoney(invoice.totalAmount - invoice.outstandingAmount),
    remainingBalance: invoice.outstandingAmount,
    items: invoice.items as ReceiptItem[],
    total: invoice.totalAmount
  };

  dbReceive.save(receipt);
  return receipt;
};

export const getPaymentInfo = (id: string) => {
  return dbPayment.findById(id);
};

export const getReceiptInfo = (id: string) => {
  return dbReceive.findById(id);
};
