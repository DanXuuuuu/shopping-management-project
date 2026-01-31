import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../store/authSlice"; 

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = async (formData) => {

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        try {
            // 👇 修改点 3: 触发 Redux action
            await dispatch(register(formData)).unwrap();
            
            console.log('Signup success');
            alert('Registration successful!');
            
            // 不需要手动 localStorage，slice 已经存了
            navigate('/'); 

        } catch (error) {
            console.error('Signup error:', error);

            const errorMsg = 
            error.message ||                 // Redux Toolkit 序列化后的错误信息
            error.response?.data?.message || // 常见的 Express 错误格式
            error.response?.data?.error ||   // 你的 errorHandler 格式
            "Unknown error occurred";

            alert(`Registration failed: ${errorMsg}`);
        }
    }

    return (
       <AuthForm
           title="Sign up an account"
           submitText="Sign Up"
           fields={[
            {name:'username', type:'text'},
            {name:'email', type: 'email'},
            {name:'password', type:'password'},
            {name:'confirmPassword', type:'password'}
           ]} 
           onSubmit={handleSignUp}
       />
    );
}

export default SignUp;
/*
import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { signup } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";


const SignUp = () =>{
// form data from authform transfer
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = async(formData)=>{
        try{
            // call the signup api 
            const data = await signup(formData);
            // test
            console.log('signup succsess:', data);

            // store to redux
            dispatch(loginSuccess({
                user: data.user,
                token: data.token
            }))

            // token and user data part 
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));  

            // pop
            alert('Registration successful');
            navigate('/');


        }catch(error){
            console.log('Signup error:', error);
            alert('registration failed');

        };
    }
    return (
       <AuthForm
       title="Sign up an account"
       submitText="Create account"
       fields={[
        {name:'username', type:'text'},
        {name:'email', type: 'email'},
        {name:'password', type:'password'},
        {name:'confirmPassword', type:'password'}
       ]} 
        onSubmit={handleSignUp}
       />
    );
}

export default SignUp;*/