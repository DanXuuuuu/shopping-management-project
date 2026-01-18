const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

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
        // not finish yet cuz validate not write yet 
        validate:{
            validator: function(password){
             

            },
            message: 'Invalid password input!'
        }

    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});
// model makes schema could be operate 
const User = mongoose.model('User', userSchema);


module.exports = User;