import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ⚠️ 请根据你的后端端口调整 (3000 或 8080)
const BASE_URL = 'http://localhost:8080/api/auth';

// --- Helper: 持久化状态读取 (Requirement 1.f) ---
const getUserFromStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        // 必须同时有 user 和 token 才算登录
        if (user && token) {
            return { user, token, isAuthenticated: true };
        }
    } catch (e) {
        console.error("Failed to load user from storage", e);
    }
    return { user: null, token: null, isAuthenticated: false };
};

// --- Async Thunks (异步业务逻辑) ---

// 1. Sign Up (Requirement 1.a)
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
            
            // 注册成功后自动登录：存入 LocalStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data; 
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 2. Sign In (Requirement 1.b)
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
            
            // 捕获 400/404 等错误 (如 "User not found")
            if (!res.ok) throw new Error(data.message || 'Login failed');

            // 保存用户状态 (包含 role，满足 Req 1.e Admin 权限)
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 3. Update Password (Requirement 1.c)
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwordData, { rejectWithValue, getState }) => {
        try {
            // 获取当前的 Token
            const { auth } = getState(); 
            
            const res = await fetch(`${BASE_URL}/profile/password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}` // 必须带 Token
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
    user: savedAuth.user,     // 包含 _id, username, email, role
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
        // Logout 逻辑 (Requirement 1.d)
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            
            // 清除 Auth 缓存
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            // ✨ 关键点：登出时清除购物车缓存 (guest_cart)
            // 这样下一个用户登录时不会看到上一个人的购物车
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
                // payload.user 里必须包含 role: 'admin'/'user'
                state.user = action.payload.user; 
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // UI 会根据这个显示 Error Alert
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

export const { logout, clearError } = authSlice.actions;
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