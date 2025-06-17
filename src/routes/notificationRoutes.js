const express = require('express');
const protect = require('../middlewares/authMiddleware');
const Router =express.Router();
const {getMyNotifications ,markAsRead}  = require('../controllers/notificationController');

Router.get('/',protect,getMyNotifications);
Router.patch('/:id/read',protect,markAsRead);


module.exports = Router;