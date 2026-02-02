import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../store/authSlice"; 
// import { fetchCart } from '../../store/cartSlice';

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = async (formData) => {

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // thunk - automatic loading states & centralized 
        try {
             //trigger Redux action:  fetch POST api/ wait response/update state
            // create an aysnc action - return a thunk function 
            // sends the action to redux - return a promise
            // unwrap - unpack redux promise to regular promise
            await dispatch(register(formData)).unwrap();
            
            console.log('Signup success');
            // this part retrive the cart after sign up
            // （but i think new users dont have to fetch cart cuz cart it's empty so..)
            // await dispatch(fetchCart());

            alert('Registration successful!');
            
            // auto - localStorage，slice already store 
            navigate('/'); 

        } catch (error) {
            console.error('Signup error:', error);

            const errorMsg = 
            error.message ||                 // Redux Toolkit 序列化后的错误信息
            error.response?.data?.message || // usual Express error format
            error.response?.data?.error ||   //   errorHandler format
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