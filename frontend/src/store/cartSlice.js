import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "guest_cart";

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed.items || {};
  } catch {
    return {};
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem(
    GUEST_CART_KEY,
    JSON.stringify({ items })
  );
};

const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};


const BASE_URL_API = 'http://localhost:8080/api';
/**
 * Promo validate
 * POST /api/promos/validate  body: { code }
 */
export const validatePromoCode = createAsyncThunk(
  "cart/validatePromoCode",
  async (code, { rejectWithValue }) => {

    try {
      const res = await fetch(`${BASE_URL_API}/promos/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // headers: { Authorization: `Bearer ${token}` }
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to validate promo");
      }

      return data; // { code, discount, isValid, message }

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Fetch cart
 * GET /api/cart => { items }
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to fetch cart");
      }

      return data; // { items }

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

/**
 * Save cart
 * PUT /api/cart  body: { items }
 */

export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async (items, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // headers: { Authorization: `Bearer ${token}` }
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to save cart");
      }

      return data; // { items }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isOpen: false,
  dirty: false,
  promoInput: "",
  items: {   // loadGuestCart(),
    p1: 1,
    p2: 2,
    p3: 3,
  },
  promo: {
    status: "idle",
    error: null,
    code: "",
    discount: 0,
    message: "",
    isValid: false,
  },
  cartSync: {
    fetchStatus: "idle",
    fetchError: null,
    saveStatus: "idle",
    saveError: null,
  },
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    //  Add item from product page button logic
    // const handleAdd = () => {
    //   dispatch(
    //     addToCart({
    //       productId: product._id,
    //       maxQty: product.countInStock,
    //     })
    //   );
    // };
    addToCart:(state, action) => {
      const { productId, maxQty } = action.payload;

      const currentQty = state.items[productId] || 0;

      if (currentQty >= maxQty) return;
    
      state.items[productId] = currentQty + 1;
    
      state.promo = null; 
      state.dirty = true;
      
      saveGuestCart(state.items);
    },
    increaseQty: (state, action) => {
      const { productId, maxQty } = action.payload;

      if (!state.items[productId]) return;
      if (state.items[productId] >= maxQty) return;

      state.items[productId] += 1;
      state.promo = null;
      state.dirty = true;

      saveGuestCart(state.items);
    },
    decreaseQty: (state, action) => {
      const { productId } = action.payload;
      const currentQty = state.items[productId];

      if (!currentQty) return;
      if (currentQty === 1) {
        delete state.items[productId];
      } else {
        state.items[productId] = currentQty - 1;
      }
      state.dirty = true;

      saveGuestCart(state.items);
    },
    removeItem: (state, action) => {
      const { productId } = action.payload;
      delete state.items[productId];
      state.dirty = true;
      state.promo = null;

      saveGuestCart(state.items);
    },
    setPromoInput: (state, action) => {
      state.promoInput = action.payload;
    },
    setCart: (state, action) => {
      state.items = action.payload || {};
      state.dirty = false;
    },
  },
  extraReducers:
    (builder) => {
      builder
      //Promo validate
        .addCase(validatePromoCode.pending, (state) => {
          state.promo.status = "loading";
          state.promo.error = null;
        })
        .addCase(validatePromoCode.fulfilled, (state, action) => {
          state.promo = {
            ...state.promo,
            ...action.payload,    // 后端回传 code, discount, message, isValid 
            status: "succeeded",
            error: null,
            message: action.payload.message || (action.payload.isValid ? "Applied!" : "Invalid"),
          };
        })
        .addCase(validatePromoCode.rejected, (state, action) => {
          state.promo = {
            ...state.promo,
            status: "failed",
            error: action.payload,
            message: action.payload,
            isValid: false,
          };
        })
      
        //fetch cart
        .addCase(fetchCart.pending, (state) => {
          state.cartSync.fetchStatus = "loading";
          state.cartSync.fetchError = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.cartSync.fetchStatus = "succeeded";
          state.cartSync.fetchError = null;

          const items = action.payload?.items || {};
          state.items = items;
          state.dirty = false;

            clearGuestCart();
        })
        .addCase(fetchCart.rejected, (state, action) => {
          state.cartSync.fetchStatus = "failed";
          state.cartSync.fetchError = action.payload || "Failed to fetch cart";
        })

         //save cart
        .addCase(saveCart.pending, (state) => {
          state.cartSync.saveStatus = "loading";
          state.cartSync.saveError = null;
        })
        .addCase(saveCart.fulfilled, (state, action) => {
          state.cartSync.saveStatus = "succeeded";
          state.cartSync.saveError = null;

          const items = action.payload?.items;
          if (items) state.items = items;

          state.dirty = false;
        })
        .addCase(saveCart.rejected, (state, action) => {
          state.cartSync.saveStatus = "failed";
          state.cartSync.saveError = action.payload || "Failed to save cart";
        });
    },

},
        
)

export const {
  openCart,
  closeCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  setPromoInput,
  setCart
} = cartSlice.actions;

export default cartSlice.reducer;