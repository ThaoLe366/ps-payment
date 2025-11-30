import { Invoice, InvoiceItem, Payment, Receipt } from '../types';

// Generic repo
class DbRepo<T extends { id: string }> {
  private data: T[] = [];

  constructor(initialData: T[] = []) {
    this.data = initialData;
  }
  saveAll(items: T[]): void {
    this.data.push(...items);
  }
  save(item: T): void {
    this.data.push(item);
  }

  findById(id: string): T | null {
    return this.data.find((item) => item.id === id) ?? null;
  }

  findAll(): T[] {
    return this.data;
  }
  updateById(item: T) {
    let existIndex = this.data.findIndex((value) => value.id === item.id);
    if (existIndex == -1) {
      console.log('[WARNING] Update not exist record');
      return;
    }

    this.data[existIndex] = {
      ...item,
      id: item.id,
    };
  }
}
// Fake for db
export const dbInvoice = new DbRepo<Invoice>();
export const dbInvoiceItem = new DbRepo<InvoiceItem>();
export const dbPayment = new DbRepo<Payment>();
export const dbReceive = new DbRepo<Receipt>();
