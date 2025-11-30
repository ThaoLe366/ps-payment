import Joi from "joi";
import { PaymentMethod } from "../types";

export interface PaymentDTO {
    amount: number;
    method: PaymentMethod;
    invoiceNumber: string;
}

export const paymentDTOSchema = Joi.object({
    invoiceNumber: Joi.string().required(),
    method: Joi.string().valid(...Object.values(PaymentMethod)),
    amount: Joi.number().greater(0).required().messages({
         "number.base": "amount must be number",
        "number.greater": "amount must be greater than 0",
    }) 
}).unknown(true);