// import package we need 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// here is read the env file 
dotenv.config();
// call the connectdb
connectDB();

// create express app 
const app = express();

// middleware
app.use(cors()); //allow frontend visit  
app.use(express.json()); //analysis the json format request 
app.use('/api/auth', require('./routes/auth'));





// test route
app.get('/',(req, res)=>{
    res.json({message:'backend running'});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});