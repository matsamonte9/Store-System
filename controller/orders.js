const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Order = require('../models/Orders');
const Product = require('../models/Products');
const orderSchema = require('../config/finalize-order-validator');

const getAllOrders = async (req, res) => {
  const { status } = req.query;
  const queryObject = {};

  if (status) {
    if (status === 'drafts') queryObject.status = 'draft';
    else if (status === 'pendings') queryObject.status = 'pending';
    else queryObject.status = 'completed';
  }

  const orders = await Order.find(queryObject);
  res.status(StatusCodes.OK).json({ orders });
}

const createOrder = async (req, res) => {
  const newOrder = await Order.create({
    status: 'draft',
    supplierName: null,
    orderType: 'personal',
    deliveryDate: null,
    items: [],
  });

  res.status(StatusCodes.CREATED).json({ newOrder });
}

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order });
}

const finalizeOrder = async (req, res) => {
  const { params: { orderId } }= req;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  if (order.items.length === 0) {
    throw new BadRequestError('Cannot save an empty order');
  }

  const { error, value } = orderSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message, error.details[0].path[0]);
  }

  Object.assign(order, value);
  if (order.status === 'draft') {
    order.status = 'pending';
  } else if (order.status === 'pending') {
    order.status = 'completed';

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.itemType === 'replacement') {
        product.stock = item.quantity;
        product.expirationDate = item.expirationDate;
      } else {
        product.stock += item.quantity;
        product.expirationDate = item.expirationDate;
      }

      await product.save();
    }
  }
  
  await order.save();
  res.status(StatusCodes.OK).json({ order, msg: 'Order Successfully Added'});
}

const deleteOrder = async (req, res) => {
  const { params: { orderId } } = req;

  const order = await Order.findOneAndDelete({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Product successfully deleted'});
}

const addOrReplaceItem = async (req, res) => {
  const { body: { productId, quantity, itemType }, params: { orderId }} = req;
  const type = itemType || 'adding';

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }

  const existingItem = order.items.find(i => i.productId.toString() === productId && i.itemType === type);

  if (existingItem) {
    if (existingItem.itemType === 'replacement') {
      throw new BadRequestError('This replace item was already in the List')
    }
    existingItem.quantity += quantity;
  } else {
    if (itemType === 'replacement') {
      const newItem = {
        productId: product._id,
        productName: product.name,
        quantity: product.stock,
        unitPrice: product.cost,
        itemType: 'replacement'
      }
      order.items.push(newItem);
    } else {
      const newItem = {
        productId: product._id,
        productName: product.name,
        quantity: quantity || 1,
        unitPrice: product.cost,
      }
      order.items.push(newItem);
    }
  }

  await order.save();
  res.status(StatusCodes.OK).json({ order });
}

const editItem = async (req, res) => {
  const { body: { quantity, expirationDate }, params: { productId, orderId }, query: { itemType } } = req;
  const type = itemType || 'adding';

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }
  
  if (quantity <= 0) {
    throw new BadRequestError(`Quantity can't be 0`)
  }

  const item = order.items.find(i => i.productId.toString() === productId && i.itemType === type);
  if (!item) {
    throw new NotFoundError(`Product ${productId} not found in the order`);
  }
  
  if (item.itemType === 'replacement') {
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError(`No product with id ${productId}`);
    }

    if (quantity > product.stock) {
      throw new BadRequestError(`Can't be greater than stock`);
    }
  }

  item.quantity = quantity;
  item.expirationDate = expirationDate ? new Date(expirationDate) : null;
  
  await order.save();
  res.status(StatusCodes.OK).json({ order });
}

const deleteItem = async (req, res) => {
  const { orderId, productId } = req.params;
  const { itemType } = req.query;

  const type = itemType || 'adding';

  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  const item = order.items.find(i => i.productId.toString() === productId  && i.itemType === type);
  if (!item) {
    throw new NotFoundError(`Product ${productId} not found in the order`);
  }

  order.items = order.items.filter(i => !(i.productId.toString() === productId && i.itemType === type));

  await order.save();

  res.status(StatusCodes.OK).json({order, msg: `Product is deleted successfully!` });
}

module.exports = {
  getAllOrders,
  createOrder,
  getOrder,
  finalizeOrder,
  deleteOrder,
  addOrReplaceItem,
  editItem,
  deleteItem,
}