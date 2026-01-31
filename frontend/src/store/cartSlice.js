import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const GUEST_CART_KEY = "guest_cart";
const BASE_URL_API = 'http://localhost:8080/api'; // 请确保端口号正确

// --- Helper: Local Storage ---
// 加载本地购物车
const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    
    // 兼容逻辑：不管存的是对象还是数组，最终我们都需要一个数组
    if (Array.isArray(parsed)) return parsed;
    if (parsed.cartItems) return parsed.cartItems; // 兼容旧名字
    if (parsed.items) return parsed.items;         // 兼容旧名字
    return [];
  } catch {
    return [];
  }
};

// 保存本地购物车
const saveGuestCart = (cartItems) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
};

// 清空本地购物车
const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

// --- Async Thunks (异步操作) ---

// 1. 验证 Promo Code
export const validatePromoCode = createAsyncThunk(
  "cart/validatePromoCode",
  async (code, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL_API}/promos/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message || "Failed to validate promo");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 2. 获取购物车 (Fetch)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth || !auth.token) return []; // 未登录返回空数组

      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message);

      // 确保返回的是数组
      // 后端可能返回 { items: [...] } 或 { cartItems: [...] }
      return data.items || data.cartItems || []; 

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 3. 保存购物车 (Save)
export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async (cartItems, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth || !auth.token) return cartItems; // 未登录不存后端

      // 转换格式：前端是完整对象数组，发给后端只发 { product: ID, qty: N }
      const payload = cartItems.map(item => ({
        product: item.product._id || item.product, 
        qty: item.qty
      }));

      const res = await fetch(`${BASE_URL_API}/cart`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${auth.token}`
        },
        body: JSON.stringify({ items: payload }), // 后端通常期望 keys 叫 items
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.message);
      
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
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    
    // ✅ AddToCart: 使用 cartItems
    addToCart: (state, action) => {
      const product = action.payload; // 必须是完整 Product 对象
      
      // 使用 cartItems 查找
      const existingItem = state.cartItems.find((item) => item.product._id === product._id);

      if (existingItem) {
        if (existingItem.qty < product.countInStock) {
           existingItem.qty += 1;
        }
      } else {
        // 使用 cartItems 推入
        state.cartItems.push({
          product: product, 
          qty: 1
        });
      }
      
      state.promo = initialState.promo; // 重置折扣
      state.dirty = true;
      saveGuestCart(state.cartItems);   // 保存到本地
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
    
    // 登出清空
    clearCart: (state) => {
        state.cartItems = [];
        clearGuestCart();
    }
  },
  
  extraReducers: (builder) => {
      builder
        // Promo
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
          // ✅ 赋值给 cartItems
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
            
            // 1. 清空数组
            state.cartItems = [];
            
            // 2. 重置所有状态回初始值
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

            // 3. 同时也清除本地缓存
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