import { InvoiceDTO } from "./invoice/invoice.type";
import { PaymentDTO } from "./payment/payment.type";
import { PaymentMethod } from "./types";
import { printShortInfo } from "./utils";
import { EventControl } from "./events/saga";
import { createInvoice, getInvoiceById } from "./invoice";
import { getPaymentInfo, getPaymentInvoiceById, getReceiptInfo, paymentProcess } from "./payment";

console.log("Scenarios 1");
new EventControl();

const items: InvoiceDTO[] = [
    { description: " Monthly fee", quantity: 1, unitPrice: 500 },
    { description: " Activity fee", quantity: 2, unitPrice: 25.50 },
]
const taxRate = 0.07;
const invoice =  createInvoice(items, taxRate);
console.log(invoice)
console.log("=========Process payment and result ===============")


const payment1 : PaymentDTO = {
    invoiceNumber: "InvoiceId_0",
    amount: 100, method: PaymentMethod.Cash
}

const payment2 : PaymentDTO = {
     invoiceNumber: "InvoiceId_0",
    amount: 200.0, method: PaymentMethod.BankTransfer
}

console.log(printShortInfo(paymentProcess(payment1)));
console.log(printShortInfo(paymentProcess(payment2)));

console.log("==========Get payment info in db==============")
console.log(getPaymentInfo("PaymentId_0"))
console.log(getPaymentInfo("PaymentId_1"))
console.log(getPaymentInfo("PaymentId_2"))

console.log("==========Get receipt info in db==============")
console.log(getReceiptInfo("ReceiptId_0"))
console.log(getReceiptInfo("ReceiptId_1"))
console.log(getReceiptInfo("ReceiptId_2"))

console.log("==========Get invoice info in Invoice system ==============")
console.log(getInvoiceById("InvoiceId_0"))

console.log("==========Get PaymentInvoiceById info in Invoice system ==============")
console.log(getPaymentInvoiceById("InvoiceId_0"))



