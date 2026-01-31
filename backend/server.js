const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');

// here is read the env file 
dotenv.config();
// call the connectdb
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

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
