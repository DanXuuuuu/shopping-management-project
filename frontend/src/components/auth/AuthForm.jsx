// reusable form components

import React from "react";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation"; 
import { TextField, Button, Box, Paper,Typography, IconButton, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";


// use props
const AuthForm = ({title, submitText, fields, onSubmit}) => {

// control components 
    const [ formData, setFormData ] = useState({});
    const [ errors, setErrors ] = useState({});
    const navigate = useNavigate();
    const [ showPassword, setShowPassword ] = useState({}); 


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
// change the status to show/hide
    const handleTogglePassword = (fieldName) =>{
        setShowPassword({
            ...showPassword,
            [fieldName]: !showPassword[fieldName]
        });
    };

    // X button 
     const handleClose = () => {
        navigate('/');  
    };
    return (
        <Box
        sx={{
            minHeight:'100vh',
            display:'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:'#f5f5f5',
            padding: 2 

        }}
        
        >
           <Paper
           sx={{
            padding: 6,
            maxWidth: 400,
            width:'100%',
            borderRadius:2,
            boxShadow: 3,
            position: 'relative' 
           }}
           >
    <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'gray'
                    }}
                >
                    <CloseIcon />
                </IconButton>


            {/* title */}
             <Typography 
             variant="h5"
             align="center"
             sx={{
                mb: 3,
                fontWeight:600
             }}

             >{ title }</Typography>
            <form onSubmit={handleSubmit}>
            {/* iterate the fields */}
            {fields.map((field)=>(
               <div key={field.name}>


                
                <TextField
                fullWidth
                margin="normal"
                label={field.name.charAt(0).toUpperCase()+ field.name.slice(1)}
               // if it's password type & click the show button, changed to 'text'
                type={(field.type === 'password' && showPassword[field.name])
                    ?'text'
                    : field.type

                }
                name={field.name}

                // controller components 
                value={formData[field.name] || ''}
                onChange={handleChange}
                // red  error 
                error={!!errors[field.name]}

                helperText={errors[field.name]}
                // show /hide button 
                  InputProps ={
                    field.type === 'password' && {
                        endAdornment: (
                            <Button
                            onClick={()=> handleTogglePassword(field.name)}
                             sx={{
                                                    minWidth: 'auto',
                                                    textTransform: 'none',
                                                    color: 'grey',
                                                    fontWeight: 600,
                                                    padding: '4px 4px',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                            
                            >
                                { showPassword[field.name] ? 'Hide' : 'Show'}
                            </Button>
                        )
                    }
                  }
                />
               
               </div> 
            ))}
                
                <Button
                 type="submit"
                 fullWidth
                 variant="contained"
                 size="large"
                 sx={
                    {
                        mt:3,
                        backgroundColor: '#4A3FCA',
                        // no need all Uppercase
                        textTransform:'none',
                    '&:hover': {
                        backgroundColor: '#6356ef'
                    }
                    }
                 }
                 >{ submitText }</Button>
                    {/* for the Sign In bottom link */}
                    {title === 'Sign in to your account' && (
                        <Box sx={{ mt:2,
                            display:'flex',
                            justifyContent:'space-between',
                            alignItems:'center'
                         }}>
                            <Typography variant="body2" 
                            color="textSecondary"
                          
                            >
                                Don't have an accout? {' '}
                                <Link href="/signup"
                                sx={{
                                    color:'#4A3FCA', 
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                }}
                                >
                                    Sign Up  
                                </Link>
        </Typography>

                                    <Link href="/update-password" 
                                    sx={{ color:'#4A3FCA',
                                        textAlign:'right',
                                        '&:hover':{
                                            textDecoration:'underline'
                                        }
                                    }}>
                                        Forgot Password?</Link>
               



                        </Box>
                        
                    )}
                    {/* for the Sign In bottom link */}
                {title === 'Sign up an account' && (
                    <Typography variant="body2"
                        color="textSecondary"
                        sx={{ textAlign: 'center', mt: 2 }}
                        >
                        Already have an account? <Link href='/signin'
                        sx={{
                            color:'#4A3FCA',
                                        textAlign:'right',
                                        '&:hover':{
                                            textDecoration:'underline'}
                        }}
                        >Sign In</Link>
                    </Typography>
                )}

            </form>
           </Paper>
        </Box>
    );
}

export default AuthForm;