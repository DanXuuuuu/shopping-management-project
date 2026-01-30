const validatePromo  = (req,res) =>{

    const raw = req.body?.code || '';
    const code = String(raw).trim().toUpperCase();

    if(!code){
        return res.status(400).json({ message: "Promo code is required" });
    }

    const PROMOS = {
        "20 DOLLAR OFF": { type: "fixed", discount: 20, message: "Applied $20 off!" },
        "10 DOLLAR OFF": { type: "fixed", discount: 10, message: "Applied $10 off!" },
      };

    const promo = PROMOS[code];

    if (!promo) {
        return res.status(400).json({ message: "Invalid promo code" });
      }

   return res.json({
    code,
    discount: promo.discount,
    isValid: true,
    message: promo.message
   });
}

module.exports = { validatePromo };