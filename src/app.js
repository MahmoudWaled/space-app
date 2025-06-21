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
const { swaggerUi, swaggerSpec } = require('./swagger');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/Uploads', express.static(path.join(__dirname, '/../Uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/user',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/',(req,res)=>{
    res.send("hello")
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});


module.exports = app ;