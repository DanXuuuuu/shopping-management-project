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
            //  trigger Redux action and return result 
            // unwrap() unpacks promise：success return data，false return error
            const userData = await dispatch(login(formData)).unwrap();
            
            console.log('Login success:', userData);
            
            if (cartItems && cartItems.length > 0) {
                // situation A: cart has items
                // “upload and merge” to db first
                console.log("Syncing guest cart to server...");
                await dispatch(saveCart({ 
                    items: cartItems,       // cart item
                    token: userData.token   // newest token 
                })).unwrap();
            }
                
              // after upload and then get data one more time 
            await dispatch(fetchCart());

            alert(`Login successful! Welcome ${userData.username || 'User'}`);
            navigate('/'); 

        } catch (error) {
            console.error('Login failed:', error);

            const errorMsg = typeof error === 'string' 
                ? error 
                : (error.message || JSON.stringify(error));

            // check "User not found"
            // backend return  404 "User not found, please sign up"
            // we check message if has 'not found'  keyword
            const isUserNotFound = errorMsg.toLowerCase().includes('not found') || 
                                   errorMsg.toLowerCase().includes('sign up');

            if (isUserNotFound) {
                // pop the sign up box 
                const confirmSignup = window.confirm("Account does not exist. Do you want to sign up?");
                if (confirmSignup) {
                    navigate('/signup');
                }
            } else {
                // other errors like Invalid password 401）-  Alert
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