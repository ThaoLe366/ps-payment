/**
 * Round by 2 decimal
 * @param n Amount
 * @returns 
 */
export const roundedMoney = (n: number): number => {
    return parseFloat(n.toFixed(2));
}
var mInvoiceItemId = 0;
export const generateInvoiceItemId = () : string => {
    return `InvoiceItemId_${mInvoiceItemId++}`;
}


var mInvoiceId = 0;
export const generateInvoiceId = () : string => {
    return `InvoiceId_${mInvoiceId++}`;
}


var mPaymentId = 0;
export const generatePaymentId = () : string => {
    return `PaymentId_${mPaymentId++}`;
}


var mReceiptId = 0;
export const generateReceiptId = () : string => {
    return `ReceiptId_${mReceiptId++}`;
}

var mUnknownPaymentId = 0;
export const generateUnknownPaymentId = () : string => {
    return `UnknownPayment_${mReceiptId++}`;
}

export const printShortInfo = (data: any) => {
    if (null == data) {
        return data;
    }
    delete data.items;
    return data;
}
