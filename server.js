const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const app = require('./src/app');


dotenv.config();
connectDB();


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));