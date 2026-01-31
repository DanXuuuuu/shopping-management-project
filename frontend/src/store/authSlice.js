import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Helper: 获取后端错误信息 ---
// 这里的逻辑是：如果后端返回了 { message: "Invalid email" }，我们就提取出来
const getErrorMsg = (error) => {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
};

// 1. ✨ Req F: 页面刷新保持登录 (Persistence) ✨
// 初始化时，先去 LocalStorage 看看有没有存过的用户信息
const userFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

// 初始状态
const initialState = {
    user: userFromStorage, // 如果本地有，直接恢复用户数据
    token: userFromStorage?.token || null, // 顺便恢复 Token
    isAuthenticated: !!userFromStorage, // 有数据就是已登录
    loading: false,
    error: null,
    success: false // 用于判断操作是否成功(比如修改密码成功)
};

// --- Async Thunks (异步操作) ---

// 2. ✨ Req A: Sign Up Flow ✨
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            // 发送请求到后端
            const { data } = await axios.post('/api/auth/signup', userData, config);
            
            // 注册成功通常直接登录，保存到 LocalStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            // 捕获后端的 Validation 错误
            return rejectWithValue(getErrorMsg(error));
        }
    }
);

// 3. ✨ Req B: Sign In Flow ✨
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/login', userData, config);

            // 登录成功，保存到 LocalStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMsg(error));
        }
    }
);

// 4. ✨ Req C: Update Password ✨
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwords, { getState, rejectWithValue }) => {
        try {
            // 获取当前的 Token 用于鉴权
            const { auth } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`, // 必须带 Token
                },
            };
            
            // 发送请求
            const { data } = await axios.put('/api/auth/profile/password', passwords, config);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMsg(error));
        }
    }
);

// 5. Logout
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('userInfo'); // 清除本地存储
    // 如果你有 clearCart 的 action，也可以在这里 dispatch
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 重置状态 (比如修改密码成功后，重置 success 标记)
        resetAuthStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Register ---
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload; // 包含 user info 和 token
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // 后端的错误信息会存在这里
            })
            // --- Login ---
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // --- Logout ---
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
             // --- Update Password ---
             .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
                state.success = true; // 标记修改成功
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAuthStatus } = authSlice.actions;
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