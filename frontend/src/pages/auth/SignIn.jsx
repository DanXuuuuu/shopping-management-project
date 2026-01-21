import React from "react";
import AuthForm from "../../components/auth/AuthForm";

const SignIn = () =>{
    return (
        <AuthForm 
        title="Sign In"
        submitText="Sign In"
        fields={[
            {name: 'email', type: 'email'},
            {name: 'password', type: 'password'}
        ]}
        />
    )
}
export default SignIn;