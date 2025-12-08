const Joi = require('joi');

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
  stock: Joi.number().min(0).required().label('Stock').custom((value, helpers) => {
    const obj = helpers.state.ancestors[0];

    if (obj.expirationDate && value < 1) {
      return helpers.error('any.custom', { message: 'If Expiration Date is provided, Stock must at least be 1'});
    }

    return value;
  }),
  expirationDate: Joi.date().empty(["", null]).default(null).label('Expiration Date').when('consumptionType', {
    is: Joi.valid('short', 'long', 'isExpiring'),
    then: Joi.required().messages({
      'any.required': 'Expiration Date is required, Consumption Type is provided'
    }),
    otherwise: Joi.optional()
  }).custom((value, helpers) => {
    const obj = helpers.state.ancestors[0];
    if (value && obj.consumptionType === 'noExpiry') {
      return helpers.error('any.custom', { message: "Consumption Type can’t be No Expiration, Expiration Date is provided" });
    }

    return value;
  }),
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

const updateProductSchema = productSchema.fork(['name', 'barcode', 'cost', 'price', 'category', 'stock'], field => field.optional());

module.exports = { productSchema, updateProductSchema };