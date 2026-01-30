
//demo db data
const cartStore = {
    demoUser: { items: { p1: 1, p2: 2 } },
};

const getUserId = () => "demoUser";

const getCart = (req, res) => {
    const userId = getUserId();//  login：const userId = req.user.id;
    const cart = cartStore[userId] || { items: {} };

    return res.json({ items: cart.items });
};

const updateCart = (req, res) => {

    console.log("req.body =", req.body);

    const userId = getUserId();  //  after login：const userId = req.user.id;

    if (!req.body) {
        return res.status(400).json({ message: "Missing request body" });
      }

    const items = req.body?.items;

    const newCart = {};
    for (const [productId,qty] of Object.entries(items)) {
        const n = Number(qty);
        newCart[productId] = n;
    }

    cartStore[userId] = { items: newCart };

    return res.json({ items: newCart });
};

module.exports = { getCart, updateCart };
