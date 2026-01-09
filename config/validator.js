const Joi = require('joi');

const batchSchema = Joi.object({
  quantity: Joi
    .number()
    .min(1)
    .required()
    .label('Quantity'),
  expirationDate: Joi
    .date()
    .empty(["", null])
    .default(null)
    .label('Expiration Date')
}).messages({
  'number.base': '{#label} must be Number',
  'date.base': '{#label} must be Date',
  'number.min': '{#label} must be greater than or equal to {#limit}',
  'number.max': '{#label} must be less than or equal to {#limit}',
  'any.required': '{#label} is required',
  'any.custom': '{{#message}}',
});

const batchesSchema = Joi.object({
  batches: Joi
    .array()
    .items(batchSchema),
}).messages({
  'array.base': '{#label} must be Array',
  'any.custom': '{{#message}}',
});

const productSchema = Joi.object({
  name: Joi
    .string()
    .trim()
    .min(4)
    .max(100)
    .required()
    .label('Name'),
  barcode: Joi
    .number()
    .required()
    .label('Barcode'),
  cost: Joi
    .number()
    .min(0)
    .max(9000)
    .required()
    .label('Cost'),
  price: Joi
    .number()
    .min(0)
    .max(9999)
    .required()
    .label('Price')
    .custom((value, helpers) => {
      const obj = helpers.state.ancestors[0];

      if (value < obj.cost) {
        return helpers.error('any.custom', { message: 'Price must be higher than cost'});
      }
      return value;
    }),
  category: Joi
    .string()
    .trim()
    .valid('groceries', 'electronics')
    .required()
    .label('Category'),
  consumptionType: Joi
    .string()
    .trim()
    .empty(["", null])
    .default('noExpiry')
    .label('Consumption Type')
    .custom((value, helpers) => {
      const obj = helpers.state.ancestors[0];

      const allowed = 
        obj.category === 'groceries'
          ? ['short', 'long', 'noExpiry']
          : ['isExpiring', 'noExpiry'];

      if (!allowed.includes(value)) {
        return helpers.error('any.custom', { message: `Invalid Consumption Type for ${obj.category}` });
      }

      return value;
    }),
    batches: Joi.array().items(Joi.object({
      quantity: Joi
        .number()
        .min(1)
        .empty(["", null])
        .label('Quantity'),
      expirationDate: Joi
        .date()
        .empty(["", null])
        .default(null)
        .label('Expiration Date')
      }).default([])
      .label('Batches')
      .messages({
        'number.base': '{#label} must be Number',
        'date.base': '{#label} must be Date',
        'number.min': '{#label} must be greater than or equal to {#limit}',
        'number.max': '{#label} must be less than or equal to {#limit}',
        'any.required': '{#label} is required',
        'any.custom': '{{#message}}',
    })),
  stock: Joi.forbidden(),
  stockStatus: Joi.forbidden(),
  expirationStatus: Joi.forbidden(),
}).messages({
  'string.base': '{#label} must be String',
  'number.base': '{#label} must be Number',
  'date.base': '{#label} must be Date',
  'string.min': '{#label} length must be at least {#limit} characters long',
  'string.max': '{#label} length must be less than or equal to {#limit} characters long',
  'number.min': '{#label} must be greater than or equal to {#limit}',
  'number.max': '{#label} must be less than or equal to {#limit}',
  'any.required': '{#label} is required',
  'any.only': '{#label} must be one of {#valids}',
  'any.custom': '{{#message}}',
});

const updateProductSchema = productSchema
  .fork(['name', 'barcode', 'cost', 'price', 'category', 'consumptionType'], field => field.optional())
  // .fork(['batches', 'stock', 'stockStatus', 'expirationStatus'], field => field.forbidden());

module.exports = { productSchema, updateProductSchema, batchesSchema };