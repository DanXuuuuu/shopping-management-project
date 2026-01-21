// reusable form components

import React from "react";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";


// use props

const AuthForm = ({title, submitText, fields, onSubmit}) => {

// control components 
    const [ formData, setFormData ] = useState({});
    const [ errors, setErrors ] = useState({});


    const handleChange = (e)=>{
        const {name, value } = e.target;

        setFormData({
            // keep origin data
            ...formData, 
            // update value 
            [name]: value
        });
          if(name ==='email'){
                const error = validateEmail(value);
                setErrors({
                    ...errors,
                    email: error
                });
          }

          if(name==='password'|| name==='confirmPassword'){
            const error = validatePassword(value);
            setErrors({
                ...errors,
                [name]:error
            });
          }
    }


    const handleSubmit = (e)=>{
        // prevent stop auto refresh 
        e.preventDefault();
        

        if(onSubmit){
            onSubmit(formData);
        }
    }
    return (
        <div>
            <h2>{ title }</h2>
            <form onSubmit={handleSubmit}>
            {/* iterate the fields */}
            {fields.map((field)=>(
               <div key={field.name}>
                <input 
                
                type={field.type}
                name={field.name}
                // controller components 
                value={formData[field.name] || ''}
                onChange={handleChange}
                
                />
                {/* show error message */}
                {
                    errors[field.name] && (
                        <p style={{color:'red', fontSize:'14px'}}> 
                            {errors[field.name]}
                        </p>
                    )
                }
               </div> 
            ))}
                
                <button type="submit">{ submitText }</button>
            </form>
        </div>
    );
}

export default AuthForm;