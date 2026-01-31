// import package we need 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');


// here is read the env file 
dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');

// create express app 
const app = express();
connectDB();

// middleware
app.use(cors()); //allow frontend visit  
app.use(express.json()); //analysis the json format request 

app.use('/api/auth', authRoutes);


const promoRoutes = require("./routes/promoRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/promos", promoRoutes);

app.get("/", (req, res) => {
  res.json({ message: "backend running" });
});
// router 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', productRoutes);

// test route
app.get('/', (req, res) => {
  res.json({ message: 'backend running' });
});

// error middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
