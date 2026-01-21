
export function validatePromo(inputCode) {
    const code = (inputCode || "").trim().toUpperCase();
  
    if (!code) {
      return { code: "", discount: 0, message: "", isValid: false };
    }
  
    if (code === "20 DOLLAR OFF") {
      return {
        code,
        discount: 20,
        message: "Applied 20 DOLLAR OFF ($20 off)",
        isValid: true,
      };
    }
  
    return {
      code,
      discount: 0,
      message: "Invalid promo code",
      isValid: false,
    };
  }