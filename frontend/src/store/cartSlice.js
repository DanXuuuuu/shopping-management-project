import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";



const initialState = {
  isOpen:false,
  promoInput:"",
  items:{
    p1:1,
    p2:2,
  },
  promo: {
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
        applyPromo:(state,action) => { //createAsyncThunk
            const { code, discount, message, isValid } = action.payload;
            state.promo = { code, discount, message, isValid };
            state.promoInput = code;
          }
    }
})

export const {
    openCart,
    closeCart,
    increaseQty,
    decreaseQty,
    removeItem,
    setPromoInput,
    applyPromo

  } = cartSlice.actions;
  
  export default cartSlice.reducer;