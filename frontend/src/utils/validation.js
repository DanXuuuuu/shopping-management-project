export const validateEmail = (email)=>{
    // no email error truthy
    if(!email) return 'Email is required';


    const emailRegex =  /^\S+@\S+\.\S+$/;
    // invalid email error truthy
    if(!emailRegex.test(email)){
        return 'Invalid Email Input';
    }
    // no error falsy
    return null;
}