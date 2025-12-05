import { DbRepo } from "../db";
import { Invoice, InvoiceItem } from "../types";

export const dbInvoice = new DbRepo<Invoice>();
export const dbInvoiceItem = new DbRepo<InvoiceItem>();


