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

export const validatePassword = (password) =>{
    if(!password) return 'Password is required';

    if(password.length<6) return 'Password is less than 6';
    // password needs number, big and small letter, and symbol
    const hasNumber = /\d/.test(password);
    if(!hasNumber) return 'Password must contain at least one number';

    const hasUppercase = /[A-Z]/.test(password);
    if(!hasUppercase) return 'Password must contain at least one uppercase letter';

    const hasLowercase = /[a-z]/.test(password);
    if(!hasLowercase) return 'Password must contain at least one lowercase letter';

    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if(!hasSymbol) return 'Password must contain at least one sepcial character';
    // if no error return null
    return null;
};