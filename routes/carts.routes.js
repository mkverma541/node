const express = require('express');
const cartController = require('../controllers/carts.controller');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// routes

// add a product to the cart for userId=id
router.post("/", cartController.addItemToCart);
// get cart details of userId=id
router.get("/:id", cartController.viewCart);
// delete productId(passed in body) for userId=id
router.delete("/:id", cartController.removeFromCart);
// empty entire cart of userId=id
// router.delete("/empty-cart/:id", cartController.emptyCart);

// router
//     .route('/')
//     .get(cartsController.getAllCarts)
//     .post(cartsController.addItemsToCarts);

// router
//     .route('/:id')
//     .get(cartsController.getUserCart)
//     .delete(cartsController.deleteCarts)
//     .patch(cartsController.updateCarts);

module.exports = router;