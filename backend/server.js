// import package we need 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// read the env file 
dotenv.config();

// create express app 
const app = express();

// middleware
app.use(cors()); //allow frontend visit  
app.use(express.json()); //analysis the json format request 

// test route
app.get('/',(req, res)=>{
    res.json({message:'backend running'});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});