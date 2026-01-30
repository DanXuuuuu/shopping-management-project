import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { login } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

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
export default SignIn;