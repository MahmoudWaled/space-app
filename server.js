const dotenv = require('dotenv');
const connectDB = require('./src/config/db');


dotenv.config();
connectDB();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));