// reusable form components

import React from "react";
import { useState } from "react";
// use props

const AuthForm = ({title, submitText, fields}) => {
// control components 
    const [ formData, setFormData ] = useState({});
    const handleChange = (e)=>{
        setFormData({
            // keep origin data
            ...formData, 
            // update value 
            [e.target.name]: e.target.value
        });

    }
    const handleSubmit = (e)=>{
        // prevent stop auto refresh 
        e.preventDefault();
        console.log('Form data', formData); 

        // later verify data and send the data to the backend 
        // deal with res 
    }
    return (
        <div>
            <h2>{ title }</h2>
            <form onSubmit={handleSubmit}>
            {/* iterate the fields */}
            {fields.map((field)=>(
                <input 
                key={field.name}
                type={field.type}
                name={field.name}
                // control components 
                value={formData[field.name] || ''}
                onChange={handleChange}
                
                />
            ))}
                
                <button type="submit">{ submitText }</button>
            </form>
        </div>
    );
}

export default AuthForm;