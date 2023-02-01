const express = require('express');
const usersController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// routes

router.post('/signup', authController.signup);
router.post('/login', authController.login);


router
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.addUser);

router
    .route('/:id')
    .get(usersController.getUser)
    .delete(usersController.deleteUser)
    .patch(usersController.updateUser);

module.exports = router;