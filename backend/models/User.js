const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // validate email format 
        match:[/^\S+@\S+\.\S+$/, 'Invalid Email input!']

    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        // password format validate
        validate:{
            validator: function(password){
                // check if validate password format is fit
             if(this.isModified('password') && !password.startsWith('$2a$')){
                const hasNumber = /\d/.test(password);
                const hasSymbol =  /[!@#$%^&*(),.?":{}|<>]/.test(password);
                const hasUppercase =  /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);

                return hasNumber && hasSymbol && hasUppercase && hasLowercase;
             }
             return true;

            },
            message: 'Invalid password input!'
        }


    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});


userSchema.pre('save', async function(next){
    // check if we dont need encrypt cuz the password is not change
    if(!this.isModified('password')) return next();
    
    // the password change 
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// this is verify for check the content of login
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);

};

// model makes schema could be operate 
const User = mongoose.model('User', userSchema);
module.exports = User;