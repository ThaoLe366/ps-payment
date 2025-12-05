
export enum PaymentMethod  {
    BankTransfer= "bank_transfer",
    Cash = "cash"
}  

export enum PaymentStatus {
    InProgress = "in-progress",
    Done = "done",
    Cancel = "cancel"
}
export enum UnappliedPaymentStatus {
    Refund = "refund",
    Spending = "spending",
    Applied = "applied"
}
export interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: Date;
    items: InvoiceItem[];
    subTotal: number; // add field
    totalAmount: number;
    totalTax: number;
    outstandingAmount: number;
    status: PaymentStatus
}

export interface InvoiceItem {
    id: string,
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    taxRate: number;
    taxAmount: number;
}

export interface Payment {
    id: string;
    invoiceId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    paymentDate: Date;
    referenceNumber: string;
}

export interface Receipt {
    id: string;
    paymentId: string;
    receiptNumber: string;
    totalPaid: number;
    remainingBalance: number; // Of this invoice
    items: ReceiptItem[],
    total: number;
}
// Fix table, not modified
export interface ReceiptItem {
    id: string,
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    taxRate: number;
    taxAmount: number;
}

export interface UnknownPayment {
    id: string;
    invoiceId: string;
    paymentMethod: PaymentMethod;
    amount: number;
    paymentDate: Date;
    referenceNumber: string;
    status: UnappliedPaymentStatus;
}


// interface PaymentMethod {
//     id: string;
//     name: string; //cash, bank
    
// }