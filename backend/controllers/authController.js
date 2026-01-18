// deal with the logic of user auth (signup and login)


exports.signup = async(req, res)=>{
    try {
// not finish yet 
        res.status(200).json({
            message: 'Signup Endpoint working...'
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