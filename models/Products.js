const mongoose = require('mongoose');
const thresholds = require('../config/threshold');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 4,
    maxlength: 100,
  },
  barcode: {
    type: Number,
    required: [true, 'Please provide barcode'],
    unique: true,
  },
  cost: {
    type: Number,
    required: [true, 'Please provide cost'],
    min: [0, 'Price must be positive'],
    max: 9999,
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: [0, 'Price must be positive'],
    max: 9999,
  },
  category: {
    type: String,
    enum: ['groceries', 'electronics'],
    required: true,
  },
  consumptionType: {
    type: String,
    enum: ['long', 'short', 'isExpiring', 'noExpiry'],
  },
  stock: {
    type: Number,
    default: 0,
  },
  expirationDate: {
    type: Date,
    default: null,
  },
  stockStatus: {
    type: String,
  },
  expirationStatus: {
    type: String,
  },
}, {
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v
      return ret;
    }
  },
});

ProductSchema.pre('save', function () {
  const stockLimit = thresholds[this.category].stock;
  if (this.stock === 0) this.stockStatus = 'out of stock';
  else if (this.stock <= stockLimit) this.stockStatus = 'low stock';
  else this.stockStatus = 'high stock';

  const category = thresholds[this.category];
  const consumptionDays = category?.expiration?.[this.consumptionType]

  if (!this.expirationDate || this.consumptionType === 'noExpiry') {
    this.expirationStatus = 'no expiration';
    return;
  }

  const daysLeft = Math.ceil((this.expirationDate - new Date()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) this.expirationStatus = 'expired';
  else if (daysLeft <= consumptionDays) this.expirationStatus = 'expiring soon';
  else if (daysLeft > consumptionDays) this.expirationStatus = 'fresh';
  else this.expirationStatus = '';
});


module.exports = mongoose.model('Product', ProductSchema);