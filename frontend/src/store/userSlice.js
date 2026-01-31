import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Helper: 处理后端错误信息 ---
const getErrorMsg = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// 1. ✨ F: 初始化时读取本地存储 ✨
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage, // 如果本地有数据，直接视为已登录
  loading: false,
  error: null,
  updateSuccess: false, // 用于修改密码成功后的提示
};

// --- Async Thunks (异步动作) ---

// 登录
export const login = createAsyncThunk('user/login', async (formData, { rejectWithValue }) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/auth/login', formData, config);
    
    // 登录成功，存入本地
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMsg(error));
  }
});

// 注册 (A: Sign Up Flow)
export const signup = createAsyncThunk('user/signup', async (formData, { rejectWithValue }) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    // 注意：确保后端注册路由地址正确，有时是 /api/auth/register 或 /api/users
    const { data } = await axios.post('/api/auth/signup', formData, config); 
    
    // 注册成功后通常直接登录，存入本地
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMsg(error));
  }
});

// 修改密码 (C: Update Password Flow)
export const updatePassword = createAsyncThunk('user/updatePassword', async (passwords, { getState, rejectWithValue }) => {
  try {
    // 获取当前 Token
    const { user } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.userInfo.token}`, // 必须鉴权
      },
    };
    
    // 发送旧密码和新密码
    const { data } = await axios.put('/api/auth/profile/password', passwords, config);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMsg(error));
  }
});

// 登出
export const logout = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('userInfo');
  // 如果需要清空购物车，也可以在这里清除 cart
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUpdateSuccess: (state) => {
        state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.error = null;
      });
  },
});

export const { resetUpdateSuccess } = userSlice.actions;
export default userSlice.reducer;