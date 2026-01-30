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
    role:{
       type: String,
       enum: ['user', 'admin'],
       default: 'user' 
    },
    cart:{
        type: Array,
        default: []
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        // password format validate
        validate:{
            validator: function(password){
            //   check if the password already hashed
            if(password.startsWith('$2a$')){
                return true;
            }
            // check if validate password format is fit
                const hasNumber = /\d/.test(password);
                const hasSymbol =  /[!@#$%^&*(),.?":{}|<>]/.test(password);
                const hasUppercase =  /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);

                return hasNumber && hasSymbol && hasUppercase && hasLowercase;
          

            },
            message: 'Invalid password input!'
        }
    }
  
},
    {
        timestamps: true 
    }

);


userSchema.pre('save', async function(next){
    // check if we dont need encrypt cuz the password is not change
    if(!this.isModified('password')) return;
    
    // the password change - hash
    this.password = await bcrypt.hash(this.password, 10);

});
// this is verify for check the content of login
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);

};

// model makes schema could be operate 
const User = mongoose.model('User', userSchema);
module.exports = User;