// deal with diff error situations 

const errorHandler = (err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error',
        // tell the develper how to debug 
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler; 