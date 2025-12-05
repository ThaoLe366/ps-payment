import Joi from 'joi';

export interface InvoiceDTO {
  description: string;
  quantity: number;
  unitPrice: number;
}

export const invoiceDTOSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'quantity must be number',
    'number.integer': 'quantity must be integer',
    'number.min': 'quantity must be greater or equal than 1',
  }),
  unitPrice: Joi.number().min(0).required().messages({
    'number.base': 'unitPrice must be number',
    'number.min': 'unitPrice must be greater or equal than 0', // 0 stand for free discount item
  }),
}).unknown(true);

export const listInvoiceDTOSchema = Joi.array()
  .items(invoiceDTOSchema)
  .min(1)
  .required();
