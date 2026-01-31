const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 确保路径指向你的 User Model

// 1. 保护中间件 (Protect Middleware)
// 作用：验证用户是否登录，只有带了有效 Token 的请求才能通过
const protect = async (req, res, next) => {
    let token;

    // 检查 Header 是否包含 Authorization 并且是以 Bearer 开头
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 取出 Token (去掉 "Bearer " 前缀)
            token = req.headers.authorization.split(' ')[1];

            // 验证 Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 从数据库查找用户，排除密码字段
            // 并把查到的用户挂载到 req.user 上，方便后续 Controller 使用
            req.user = await User.findById(decoded.id).select('-password');

            next(); // 验证通过，放行！
        } catch (error) {
            console.error(error);
            res.status(401);
            // 如果 Token 过期或被篡改，抛出这个错误
            const err = new Error('Not authorized, token failed');
            err.statusCode = 401;
            next(err);
        }
    }

    if (!token) {
        res.status(401);
        const err = new Error('Not authorized, no token');
        err.statusCode = 401;
        next(err);
    }
};

// 2. 管理员中间件 (Admin Middleware)
// 作用：只有 role 为 'admin' 的用户才能通过
// 注意：必须先经过 protect 拿到 req.user 之后才能用这个
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // 是管理员，放行
    } else {
        res.status(401); // 或者 403 Forbidden
        const err = new Error('Not authorized as an admin');
        err.statusCode = 401;
        next(err);
    }
};

module.exports = { protect, admin };