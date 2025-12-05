import { DbRepo } from "../db";
import { Invoice, Payment, Receipt } from "../types";

// Fake for db
export const dbPayment = new DbRepo<Payment>();
export const dbReceipt = new DbRepo<Receipt>();
export const dbPaymentInvoice = new DbRepo<Invoice>();