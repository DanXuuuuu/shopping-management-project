
import React from "react";
import AuthForm from "../../components/auth/AuthForm";

// situations: 
// 1.already logged and change password 
    // {name:'currentPassword', type:'password'},
    // {name:'newPassword', type:'password'},
    // {name:'confirmPassword', type:'password'}

// 2.forget the password change the password(i choose this right now)
// just need email and ? dont need real email link 


const UpdatePassword = ()=>{
    const handleUpdatePassword = async(formdata)=>{
        try{

            // const data = await UpdatePassword(formdata) ;
            // console.log('Update password request:', formData);
            alert('Password updating...');



        }catch(error){

            console.error('Update password error:', error);
            alert('failed to update password')
        }
    }
    return (
        <AuthForm 
        title="Update Password"
        submitText="Update Password"
        fields={[
                {name: 'email', type: 'email'}
        ]}
        onSubmit={handleUpdatePassword}
        />
    )
}

export default UpdatePassword;