import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";


export const validatePromoCode = createAsyncThunk(
  "cart/validatePromoCode",
  async(code,{ rejectWithValue }) =>{
   
    try{
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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


const initialState = {
  isOpen:false,
  promoInput:"",
  cartItems: [],
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
         
        addToCart: (state, action) => {
          const item = action.payload;
          const existItem = state.cartItems.find((x) => x._id === item._id);

          if (existItem) {
           
            existItem.qty += 1;
          } else {
           
            state.cartItems.push({ ...item, qty: 1 });
          }
        
          state.isOpen = true; 
        },
        increaseQty: (state, action) => {
         
          const id = action.payload.productId || action.payload; 
          const item = state.cartItems.find((x) => x._id === id);
      
          
          if (item && item.qty < item.countInStock) {
            item.qty += 1;
          }
        },
        decreaseQty: (state, action) => {
          const id = action.payload.productId || action.payload;
          const item = state.cartItems.find((x) => x._id === id);

          if (item) {
            if (item.qty === 1) {
              state.cartItems = state.cartItems.filter((x) => x._id !== id);
            } else {
              item.qty -= 1;
            }
          }
        },
        removeItem: (state, action) => {
            const id = action.payload.productId || action.payload;
            state.cartItems = state.cartItems.filter((x) => x._id !== id);
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
                  ...action.payload,    
                  status: "succeeded",
                  error: null,
                  message: action.payload.message || (action.payload.isValid ? "Applied!" : "Invalid"),
                };
              })
              .addCase(validatePromoCode.rejected, (state, action) => {
                state.promo = {
                  ...initialState.promo, 
                  input: state.promoInput, 
                  status: "failed",
                  error: action.payload,
                  message: action.payload,
                };
              });
          },
        }
)

export const {
  openCart,
  closeCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  setPromoInput,
} = cartSlice.actions;

export default cartSlice.reducer;