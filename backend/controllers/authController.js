// deal with the logic of user auth (signup and login)

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// generateJWT func
const generateToken = (userId) =>{
    // return encrypted token string
    return jwt.sign(
        // payload
        {id: userId },
        // secret key - encrypt
        process.env.JWT_SECRET,
        {
            
            //expire time:
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
}


// signup 

exports.signup = async(req, res)=>{
    try {

    const { email, username, password, confirmPassword } = req.body;

    // must finish all fields
    if(!email || !username || !password || !confirmPassword){
        return res.status(400).json({
            message: 'Please finish all fields'
        });
    }
    // if password match confirmPass

    if(password !== confirmPassword){
        return res.status(400).json({
            message: 'Password does not match'
        })
    }
    //  check if user email already exist 
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({
            message: 'User email already exists!'
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
    const token = generateToken(newUser._id);


    // register successful 
        res.status(201).json({
            message: 'User registered successfully',
            token: token,
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

// login 

exports.login = async(req, res)=>{
    try{
        const { email, password } = req.body;

        // login process (must have password and email)
        if(!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }
        // check the user exist 
        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        
        // compare if the password match 
        const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword){
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
        const token = generateToken(user._id);

        // login successful
        res.status(200).json({
            message: 'User logged in successful',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    }catch(error){
        res.status(500).json({
            message: 'Server error',
            error: error.message
        })

    }
};