const express = require('express');
const categoriesController = require('../../controllers/admin/productsCategories.controller');
const router = express.Router();
const authController = require('../../controllers/auth.controller');


// routes

router
    .route('/')
    .get(categoriesController.getAllCategories)
    .post(categoriesController.addCategory);

router
    .route('/:id')
    .get(categoriesController.getCategory)
    .delete(categoriesController.deleteCategory)
    .patch(categoriesController.updateCategory);

module.exports = router;