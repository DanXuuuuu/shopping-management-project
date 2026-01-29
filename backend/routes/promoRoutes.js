const express = require("express");
const router = express.Router();
const { validatePromo } = require("../controllers/promoController");

router.route('/validate').post(validatePromo);


module.exports = router;