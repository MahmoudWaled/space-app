const express = require('express');
const authController = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const Router = express.Router();

Router.post('/register',upload.single('profileImage'),authController.register);
Router.post('/login',authController.login);

module.exports= Router;