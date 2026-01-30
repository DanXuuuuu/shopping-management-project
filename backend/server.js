const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
