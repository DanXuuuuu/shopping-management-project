// import package we need 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes')
const connectDB = require('./config/db');
// read the env file 
dotenv.config();
connectDB();
// create express app 
const app = express();

// middleware
app.use(cors()); //allow frontend visit  
app.use(express.json()); //analysis the json format request 
app.use('/api/products', productRoutes);

// test route
app.get('/',(req, res)=>{
    res.json({message:'backend running'});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});