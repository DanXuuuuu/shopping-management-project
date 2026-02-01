import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// port 
const BASE_URL = 'http://localhost:8080/api/auth';

// --- Helper: 持久化状态读取 ---
// keep it could protect the page fresh stable 
const getUserFromStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (user && token) {
            return { user, token, isAuthenticated: true };
        }
    } catch (e) {
        console.error("Failed to load user from storage", e);
    }
    return { user: null, token: null, isAuthenticated: false };
};

// --- Async Thunk ---

// 1. Sign Up
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data; 
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 2. Sign In
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 3. Update Password
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwordData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState(); 
            const res = await fetch(`${BASE_URL}/profile/password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify(passwordData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed');
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// --- Slice ---

const savedAuth = getUserFromStorage();

const initialState = {
    user: savedAuth.user,
    token: savedAuth.token,
    isAuthenticated: savedAuth.isAuthenticated,
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    
    reducers: {
        // use for App.js Manually restore login status
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },

        // Logout logic
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('guest_cart'); 
        },
        
        clearError: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // --- Login ---
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user; 
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Register ---
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Update Password ---
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = "Password updated successfully";
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

//  
export const { logout, clearError, loginSuccess } = authSlice.actions;

export default authSlice.reducer;

/*
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

*/