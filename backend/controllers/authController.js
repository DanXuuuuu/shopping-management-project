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

exports.signup = async(req, res, next)=>{
    try {

    const { email, username, password, confirmPassword } = req.body;

    // must finish all fields
    if(!email || !username || !password || !confirmPassword){
        const err = new Error('Please finish all fields');
        err.statusCode =400;
        return next(err);


    }
    // if password match confirmPass

    if(password !== confirmPassword){
        const err = new Error('Password does not match');
        err.statusCode = 400;
        return next(err);
    }
    //  check if user email already exist 
    const existingUser = await User.findOne({ email });

    if(existingUser){
        const err = new Error('User email already exists');
        err.statusCode = 400;
        return next(err);
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
       next(error);
    }
};

// login 

exports.login = async(req, res, next)=>{
    try{
        const { email, password } = req.body;

        // login process (must have password and email)
        if(!email || !password) {
            const err = new Error('Please provide email and password');
            err.statusCode =400;
            return next(err);
        }
        // check the user exist 
        const user = await User.findOne({ email });

        if(!user){
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            return next(err);
        }
        
        // compare if the password match 
        const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword){
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            return next(err);
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
         next(error);

    }
};

// exports const updatePassword balabla...