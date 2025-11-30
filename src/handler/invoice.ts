import {
  InvoiceDTO,
  listInvoiceDTOSchema,
} from './invoice.type';
import {
  Invoice,
  InvoiceItem,
  PaymentStatus,
} from './../types/index';
import { generateInvoiceItemId, roundedMoney } from '../utils';
import { dbInvoice, dbInvoiceItem as dbInvoiceItems } from '../db';
import { generateInvoiceId } from './../utils/index';

export const calInvoice = (items: InvoiceDTO[], taxRate: number) => {
  // Validate error
  const { error } = listInvoiceDTOSchema.validate(items);
  if (error) {
    console.error(`[ERROR] Validation failed: `, error.message);
    return null;
  }
  // Init
  let subTotal = 0.0;
  let tax = 0.0;
  let invoiceItems: InvoiceItem[] = [];

  for (let item of items) {
    let rawTotal = roundedMoney(item.quantity * item.unitPrice);
    let taxAmount = roundedMoney(taxRate * rawTotal);
    // lineTotal = total + tax - discount (if any)
    let lineTotal = rawTotal + taxAmount;

    subTotal += rawTotal;
    tax += taxAmount;

    const invoiceItem: InvoiceItem = {
      id: generateInvoiceItemId(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: lineTotal,
      taxAmount: taxAmount,
      taxRate: taxRate,
    };

    // Save tmp array before saving all successfully data to db
    invoiceItems.push(invoiceItem);
  }
  // luu db
  const invoiceId = generateInvoiceId();
  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber: invoiceId,
    invoiceDate: new Date(),
    items: invoiceItems,
    subTotal: subTotal,
    totalAmount: subTotal + tax,
    totalTax: tax,
    outstandingAmount: subTotal + tax,
    status: PaymentStatus.InProgress,
  };

  // Save to db
  dbInvoiceItems.saveAll(invoiceItems);
  dbInvoice.save(invoice);
  return invoice;
};

/**
 * 
 * @param id Export get db info
 * @returns 
 */
export const getInvoiceById = (id: string): Invoice | null => {
  return dbInvoice.findById(id);
};
