import { calInvoice } from "./handler";
import { InvoiceDTO } from "./handler/invoice.type";
import { getPaymentInfo, getReceiptInfo, paymentProcess } from "./handler";
import { PaymentDTO } from "./handler/payment.type";
import { PaymentMethod } from "./types";
import { printShortInfo } from "./utils";

console.log("Scenarios 1");

const items: InvoiceDTO[] = [
    { description: " Monthly fee", quantity: 1, unitPrice: 500 },
    { description: " Activity fee", quantity: 2, unitPrice: 25.50 },
]
const taxRate = 0.07;
const invoice =  calInvoice(items, taxRate);
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

