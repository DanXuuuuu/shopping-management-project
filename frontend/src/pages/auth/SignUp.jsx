import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { signup } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";


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

export default SignUp;