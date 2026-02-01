const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");
const promoRoutes = require("./routes/promoRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/promos", promoRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "backend running" });
});

// error middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
