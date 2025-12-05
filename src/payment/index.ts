import { PaymentEvents } from "../constant";
import { eventBus } from "../events";
import { initPayment } from "./payment";

export * from "./payment";
eventBus.on(PaymentEvents.PaymentCreate, ({ invoice }) => {
    initPayment(invoice);
})