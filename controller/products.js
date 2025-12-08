const Product = require('../models/Products');
const { productSchema, updateProductSchema } = require('../config/validator');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllProducts = async (req, res) => {
  const { sort, filter, name } = req.query;
  let queryObject = {};

  const totalProductCount = await Product.countDocuments();
  const lowStockCount = await Product.countDocuments({ stockStatus: 'low stock' });
  const outOfStockCount = await Product.countDocuments({ stockStatus: 'out of stock' });
  const nearExpirationCount = await Product.countDocuments({ expirationStatus: 'expiring soon' });
  const expiredCount = await Product.countDocuments({ expirationStatus: 'expired' });
  
  // if (name) {
  //   queryObject.name = { $regex: name, $options: 'i' }
  // }

   if (name) {
     queryObject.$or = [
      { name: {$regex: name, $options: 'i'} },
      { barcode: Number(name) }
     ];
   }

  if (filter) {
    if (filter === ' groceries') queryObject.category === 'groceries';
    if (filter === 'electronics') queryObject.category === 'electronics';
    if (filter === 'out-of-stock') queryObject.stockStatus = 'out of stock';
    if (filter === 'low-stock') queryObject.stockStatus = 'low stock';
    if (filter === 'high-stock') queryObject.stockStatus = 'high stock';
    if (filter === 'expired') queryObject.expirationStatus = 'expired';
    if (filter === 'expiring-soon') queryObject.expirationStatus = 'expiring soon';
    if (filter === 'fresh') queryObject.expirationStatus = 'fresh';
  }

  let result = Product.find(queryObject);

  // gacha if the attacker tried to send multiple sort with , allowedSort will false
  const allowedSort = ['name', 'cost', 'price', 'stock', 'expirationDate']

  if (sort && allowedSort.includes(sort.replace('-', ''))) {
    const sortList = sort.split(',').join(' ');
    result.sort(sortList);
  } else {
    result.sort('name');
  }

  let limit = Number(req.query.limit) || 5;
  let page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const MAX_LIMIT = 20;

  if (limit <= 0) {
    limit = 5;
  }

  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  if (page <= 0) {
    page = 1
  }

  const totalItemsCount = await Product.countDocuments();
  const totalItemsFetch = await Product.countDocuments(queryObject);
  const totalPagesCount = Math.ceil(totalItemsFetch / limit);

  if (page > totalPagesCount) {
    page = totalPagesCount;
  }

  result.skip(skip).limit(limit);

  const products = await result;

  res.status(StatusCodes.OK).json({ 
    products, 
    totalProductCount,
    lowStockCount,
    outOfStockCount,
    nearExpirationCount,
    expiredCount,
    limitCount: products.length,
    totalItemsCount,
    totalItemsFetch,
    totalPagesCount
  });
}

const getProduct = async (req, res) => {
  const { id:productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
}

const createProduct = async (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message, error.details[0].path[0]);
  }

  const product = await Product.create(value);
  res.status(StatusCodes.CREATED).json({ product, msg: 'Product is added successfully!' });
}

const updateProduct = async (req, res) => {
  const { id:productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }

  const { _id, __v, stockStatus, expirationStatus, ...cleanData } = product.toObject();

  const mergedData = { ...cleanData, ...req.body };
  
  if (mergedData.stock <= 0) {
    mergedData.expirationDate = null;
    mergedData.consumptionType = null;
  }

  const { error, value } = updateProductSchema.validate(mergedData);
  if (error) {
    throw new BadRequestError(error.details[0].message, error.details[0].path);
  }
  
  Object.assign(product, value);
  await product.save();

  res.status(StatusCodes.OK).json({ product, msg: 'Product is updated successfully' });
}

const deleteProduct = async (req, res) => {
  const { id:productId } = req.params;

  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ msg: `Product is deleted successfully!` });
}

const decreaseProductStock = async (req, res) => {
  const { items } = req.body;

  for (const item of items) {
    const product = await Product.findOne({ _id: item.productId });
    if (!product) {
      continue;
    }

    // if (product.stock === 0) {
    //   return;
    // }

    product.stock -= item.quantity;

    if (product.stock < 0) {
      product.stock = 0;
    }

    await product.save();
  }
  res.status(StatusCodes.OK).json({ msg: 'Product has been updated' });
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseProductStock,
}