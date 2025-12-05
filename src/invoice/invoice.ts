
import {
  Invoice,
  InvoiceItem,
  PaymentStatus,
} from './../types/index';
import { generateInvoiceItemId, roundedMoney } from '../utils';
import { generateInvoiceId } from './../utils/index';
import { InvoiceDTO, listInvoiceDTOSchema } from './invoice.type';
import { dbInvoice, dbInvoiceItem } from './invoice.db';
import { eventBus } from '../events';
import { PaymentProcessEvents } from '../constant';

export const createInvoice = (items: InvoiceDTO[], taxRate: number) => {
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
  dbInvoiceItem.saveAll(invoiceItems);
  dbInvoice.save(invoice);
  eventBus.emit(PaymentProcessEvents.InvoiceCreateSuccess, { invoice })
  return invoice;
};

export const cancelInvoice = (id: string) => {
   const invoice = dbInvoice.findById(id);
   if (null == invoice) {
    console.log("[WARNING]", `Invoice: ${id} is not found.`);
    return;
   }
   if (invoice.status == PaymentStatus.Cancel) {
    console.log("[WARNING]", `Invoice id: ${id} is already cancel`);
    return;
   }
   invoice.status = PaymentStatus.Cancel;
   dbInvoice.save(invoice);
   console.log("[SUCCESS]", `Cancel invoice: ${id} is successfully`);
   return;
}

export const updateInvoice = ( invoice: Invoice ) => {
  dbInvoice.updateById(invoice);
  console.log("[SUCCESS] Update invoice successfully")
}

/**
 * 
 * @param id Export get db info
 * @returns 
 */
export const getInvoiceById = (id: string): Invoice | null => {
  return dbInvoice.findById(id);
};

