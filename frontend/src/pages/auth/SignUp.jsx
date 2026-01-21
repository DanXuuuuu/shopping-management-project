import React from "react";
import AuthForm from "../../components/auth/AuthForm";
import { signup } from "../../utils/api";

const SignUp = () =>{
// form data from authform transfer
    const handleSignUp = async(formData)=>{
        try{
            // call the signup api 
            const data = await signup(FormData);
            // test
            console.log('signup succsess:', data);
            // pop
            alert('Registration successful');


        }catch(error){
            console.log('Signup error:', error);
            alert('Registration failed. ');

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