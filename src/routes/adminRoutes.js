const express = require('express');
const protect = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const Router = express.Router();


Router.get('/dashboard',protect,allowRoles('admin'),(req,res)=>{
    res.json({message:'Welcome to the admin dashboard!'})
});


module.exports = Router;