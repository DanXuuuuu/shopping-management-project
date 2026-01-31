import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice"; 
import { fetchCart, saveCart } from "../../store/cartSlice";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const handleSignIn = async (formData) => {
        try {
            //  触发 Redux action 并等待结果
            // unwrap() 会把 Promise 拆包：如果成功返回 data，如果失败抛出 error
            const userData = await dispatch(login(formData)).unwrap();
            
            console.log('Login success:', userData);
            
            if (cartItems && cartItems.length > 0) {
                // 情况 A: 如果游客购物车里有东西
                // 必须先把这些东西“上传/合并”到后端数据库
                console.log("Syncing guest cart to server...");
                await dispatch(saveCart({ 
                    items: cartItems,       // 购物车商品
                    token: userData.token   // 刚刚拿到的最新 Token
                })).unwrap();
            }
                
                // 上传完后，再去拉取一次确定的最新数据（可选，但更稳妥）
            await dispatch(fetchCart());

            alert(`Login successful! Welcome ${userData.username || 'User'}`);
            navigate('/'); 

        } catch (error) {
            console.error('Login failed:', error);

            const errorMsg = typeof error === 'string' 
                ? error 
                : (error.message || JSON.stringify(error));

            // 4. ✨ 核心修改：检测 "User not found"
            // 后端返回的是 404 "User not found, please sign up"
            // 我们检查 message 里是否包含 'not found' 关键字
            const isUserNotFound = errorMsg.toLowerCase().includes('not found') || 
                                   errorMsg.toLowerCase().includes('sign up');

            if (isUserNotFound) {
                // 弹出确认框引导注册
                const confirmSignup = window.confirm("Account does not exist. Do you want to sign up?");
                if (confirmSignup) {
                    navigate('/signup');
                }
            } else {
                // 其他错误（如 Invalid password 401）直接 Alert
                alert(`Login failed: ${errorMsg}`);
            }
        }
    }
    return (
        <AuthForm 
            title="Sign in to your account"
            submitText="Sign In"
            fields={[
                {name: 'email', type: 'email'},
                {name: 'password', type: 'password'}
            ]}
            onSubmit={handleSignIn}
        />
    )
}
export default SignIn;
/*
import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { login } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

const SignIn = () =>{

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSignIn = async(formData)=>{
        
        try{
            const data = await login(formData);
            // test 
            console.log('signIn success', data);
            // store to Redux 
            dispatch(loginSuccess({
                user: data.user,
                token: data.token
            }))
        //could use for after refresh 
            // store token at localstorage
            localStorage.setItem('token', data.token);
            // store user data at localstorage 
            localStorage.setItem('user', JSON.stringify(data.user));

            // pop successful 
            alert('Login successful');
            // go to home
            navigate('/');

        }catch(error){
            console.log('Login error:', error);
            alert('login failed');

        };
        

    }


    return (
        <AuthForm 
        title="Sign in to your account"
        submitText="Sign In"
        fields={[
            {name: 'email', type: 'email'},
            {name: 'password', type: 'password'}
        ]}
        onSubmit={handleSignIn}
        />
    )
}
export default SignIn;*/