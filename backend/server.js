// import package we need 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// read the env file 
dotenv.config();

// create express app 
const app = express();
const promoRoutes = require('./routes/promoRoutes')
const cartRoutes = require("./routes/cartRoutes");

console.log("promoRoutes:", promoRoutes);
console.log("cartRoutes:", cartRoutes);

app.use(cors()); //allow frontend visit  
app.use(express.json()); //analysis the json format request 

app.use("/api/cart", cartRoutes);
app.use('/api/promos', promoRoutes);


// test route
app.get('/',(req, res)=>{
    res.json({message:'backend running'});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});