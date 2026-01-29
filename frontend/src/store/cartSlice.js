import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";


export const validatePromoCode = createAsyncThunk(
  "cart/validatePromoCode",
  async(code,{ rejectWithValue }) =>{
   
    try{
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // headers: { Authorization: `Bearer ${token}` }
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to validate promo");
      }

      return data;

    }catch (err){
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to fetch cart");
      }

      return data; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async (items, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // headers: { Authorization: `Bearer ${token}` }
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to save cart");
      }

      return data; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isOpen:false,
  promoInput:"",
  items:{
    p1:1,
    p2:2,
    p3:3,
  },
  promo: {
    status: "idle",
    error: null,
    code: "",
    discount: 0,
    message: "",
    isValid: false,
  },
}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        openCart: (state) => {
            state.isOpen = true;
          },    
        closeCart: (state) => {
            state.isOpen = false;
          },
        increaseQty:(state,action) => {
            const {productId} = action.payload;
            state.items[productId] = (state.items[productId] || 0) + 1;
        },
        decreaseQty:(state,action) => {
            const {productId} = action.payload;
            const currentQty = state.items[productId];

            if(!currentQty) return;
            if (currentQty === 1) {
                delete state.items[productId];
              } else {
                state.items[productId] = currentQty - 1;
              }
        },
        removeItem: (state, action) => {
            const { productId } = action.payload;
            delete state.items[productId];
          },
        setPromoInput: (state, action) => {
            state.promoInput = action.payload;
        },
        },
        extraReducers: 
          (builder) => {
            builder
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
              });
          },
        }
)

export const {
  openCart,
  closeCart,
  increaseQty,
  decreaseQty,
  removeItem,
  setPromoInput,
} = cartSlice.actions;

export default cartSlice.reducer;