import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        token: null,
        isAuthenticated: false
    },
    // reducer use for modify the state 
    reducers: {
        // situation of login success 
       loginSuccess: (state, action) =>{
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
       },
        // situation of logout
       logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
       }

    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;