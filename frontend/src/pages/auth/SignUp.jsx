import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { signup } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const SignUp = () =>{
// form data from authform transfer
    const navigate = useNavigate();
    const handleSignUp = async(formData)=>{
        try{
            // call the signup api 
            const data = await signup(formData);
            // test
            console.log('signup succsess:', data);
            // token and user data part 
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));  

            // pop
            alert('Registration successful');
            navigate('/signin');


        }catch(error){
            console.log('Signup error:', error);
            alert('registration failed');

        };
    }
    return (
       <AuthForm
       title="Sign Up"
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