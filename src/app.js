const express = require('express');
const cors =require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const path = require('path');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/uploads',express.static(path.join(__dirname,'../Uploads')));
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/',(req,res)=>{
    res.send("hello")
})

module.exports = app ;