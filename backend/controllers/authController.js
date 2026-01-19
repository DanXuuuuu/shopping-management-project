// deal with the logic of user auth (signup and login)

const User = require('../models/User');


exports.signup = async(req, res)=>{
    try {

    const { email, username, password } = req.body;

    //  check if user email already exist 
    const existingUser = await User.findOne({ email: email });
    if(existingUser){
        return res.status(400).json({
            message: 'User email already exist!'
        });
    }
    // if not exist create new here: 
    const newUser = new User({
        email,
        username,
        password
    });
    // save to db
    await newUser.save();
    // register successful 
        res.status(200).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            }
        })
    }catch(error){
        res.status(500).json({
            message:'Server error',
            error: error.message
        });
    }
};
exports.login = async(req, res)=>{
    try{
        // not finish yet
        res.status(200).json({
            message: 'Login Endpoint working...'
        })

    }catch(error){
        res.status(500).json({
            message: 'Server error',
            error: error.message
        })

    }
};