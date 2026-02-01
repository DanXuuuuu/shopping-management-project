const Promo = require("../models/promo");

const validatePromo  = async(req,res) =>{
 try{
    const raw = req.body?.code || '';
    const code = String(raw).trim().toUpperCase().replace(/\s+/g, "");;

    if (!code) {
      return res.status(400).json({
        isValid: false,
        discount: 0,
        message: "Promo code is required",
      });
    }

    const promo = await Promo.findOne({ code });

    if (!promo) {
      return res.json({
        isValid: false,
        discount: 0,
        message: "Invalid promo code",
      });
    }

   return res.json({
    isValid: true,
    code: promo.code,
    discount: promo.discount, 
    message: `Applied $${promo.discount} off`,
   });
  }catch (e) {
    console.error("validatePromo error:", e);
    return res.status(500).json({
      isValid: false,
      discount: 0,
      message: "Server error validating promo",
    });
  }
}

module.exports = { validatePromo };