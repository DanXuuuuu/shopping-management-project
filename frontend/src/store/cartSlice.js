import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const GUEST_CART_KEY = "guest_cart";
const BASE_URL_API = 'http://localhost:8080/api'; 
// --- Helper: Local Storage ---

const loadGuestCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_CART_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
 
    return [];
  }
};


const saveGuestCart = (cartItems) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
};


const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

// --- Async Thunks  ---

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
      if (!res.ok) return rejectWithValue(data?.message || "Failed to validate promo");
      return data;// { code, discount, isValid, message }
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
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth || !auth.token) return []; 

      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message);
      /*
      if (Array.isArray(data)) return data;
      if (data.items && Array.isArray(data.items)) return data.items;
      if (data.cartItems && Array.isArray(data.cartItems)) return data.cartItems;
      */
      // 如果以上都不是，说明数据坏了，返回空数组保命
      return [];

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Save cart
 * PUT /api/cart  body: { items }
 */
export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async (arg, { rejectWithValue, getState }) => {
    try {
      const items = Array.isArray(arg) ? arg : arg.items;
      const token = arg.token || getState().auth.token;

      if (!token) return items; 
      const payload = items.map(item => ({
        product: item.product._id || item.product, 
        qty: item.qty
      }));

      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }, 
        body: JSON.stringify({ items: payload }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to save cart");
      }

      return data.items || []; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Initial State ---

const initialState = {
  isOpen: false,
  dirty: false,
  promoInput: "",
  
  cartItems: loadGuestCart(), 
  
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
    
    //  AddToCart
    addToCart: (state, action) => {
      const product = action.payload;  //
      if (!Array.isArray(state.cartItems)) { //Array of Objects
         state.cartItems = [];
      }

      const existingItem = state.cartItems.find((item) => item.product._id === product._id);

      if (existingItem) {
        if (existingItem.qty < product.countInStock) {
           existingItem.qty += 1;
        }
      } else {
   
        state.cartItems.push({
          product: product, 
          qty: 1
        });
      }
      
      state.promo = initialState.promo; 
      state.dirty = true;
      saveGuestCart(state.cartItems);   
    },
    
    increaseQty: (state, action) => { 
      const { productId, maxQty } = action.payload;
      const item = state.cartItems.find((x) => x.product._id === productId);

      if (item && item.qty < maxQty) {
        item.qty += 1;
        state.promo = initialState.promo;
        state.dirty = true;
        saveGuestCart(state.cartItems);
      }
    },

    decreaseQty: (state, action) => {
      const { productId } = action.payload;
      const item = state.cartItems.find((x) => x.product._id === productId);

      if (item) {
        if (item.qty === 1) {
          // 过滤移除
          state.cartItems = state.cartItems.filter(x => x.product._id !== productId);
        } else {
          item.qty -= 1;
        }
        state.dirty = true;
        saveGuestCart(state.cartItems);
      }
    },

    removeItem: (state, action) => {
      const { productId } = action.payload;
      state.cartItems = state.cartItems.filter(x => x.product._id !== productId);
      state.dirty = true;
      state.promo = initialState.promo;
      saveGuestCart(state.cartItems);
    },

    setPromoInput: (state, action) => {
      state.promoInput = action.payload;
    },
    
    setCart: (state, action) => {
      state.cartItems = action.payload || [];
      state.dirty = false;
    },
    
    
    clearCart: (state) => {
        state.cartItems = [];
        clearGuestCart();
    }
  },
  
  extraReducers: (builder) => {
      builder
        // Promo validate
        .addCase(validatePromoCode.fulfilled, (state, action) => {
          state.promo = {
            ...state.promo,
            ...action.payload,    
            status: "succeeded",
            error: null,
            message: action.payload.message || (action.payload.isValid ? "Applied!" : "Invalid"),
          };
        })
        
        // Fetch Cart
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.cartSync.fetchStatus = "succeeded";
          state.cartItems = action.payload || [];
          state.dirty = false;
          clearGuestCart();
        })
        
        // Save Cart
        .addCase(saveCart.fulfilled, (state) => {
          state.cartSync.saveStatus = "succeeded";
          state.dirty = false;
        })

        //logout clear cart action
        .addCase(logout, (state) => {
            console.log("Logout detected: Clearing cart...");
            state.cartItems = [];
            
            state.promo = {
                status: "idle",
                error: null,
                code: "",
                discount: 0,
                message: "",
                isValid: false,
            };
            state.cartSync = {
                fetchStatus: "idle",
                fetchError: null,
                saveStatus: "idle",
                saveError: null,
            };
            state.isOpen = false;
            state.dirty = false;
            state.promoInput = "";

            clearGuestCart();
        });

    },
});

export const {
  openCart,
  closeCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  setPromoInput,
  setCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;