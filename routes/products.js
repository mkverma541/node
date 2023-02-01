const express = require('express');
const productsController = require('../controllers/products');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// routes

router
    .route('/top-5-products')
    .get(productsController.aliasTopProducts, productsController.getAllProducts);

router
    .route('/')
    .get(productsController.getAllProducts)
    .post(productsController.addProduct);

router
    .route('/:id')
    .get(productsController.getProduct)
    .delete(productsController.deleteProduct)
    .patch(productsController.updateProduct);

router.route('/category/:category').get(productsController.getProductsByCategory);

module.exports = router;