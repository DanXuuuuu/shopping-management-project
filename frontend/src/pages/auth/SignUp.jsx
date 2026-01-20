import React from "react";
import AuthForm from "../../components/auth/AuthForm";

const SignUp = () =>{
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
       
       />
    );
}

export default SignUp;