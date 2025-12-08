const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseProductStock,
} = require('../controller/products');

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

router.route('/cart/decrease-stock')
  .patch(decreaseProductStock);

module.exports = router;