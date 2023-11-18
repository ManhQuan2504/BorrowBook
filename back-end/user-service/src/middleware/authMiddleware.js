const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWareAdmin = (req, res, next) => {
    const token = req.headers.token

    if (token) {
        const accessToken = token.split(" ")[1];
    
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Token đã hết hạn hoặc không phải bạn!"
                })
            }
            if (user?.isAdmin) {
                next()
            } else {
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Bạn không có quyền thực hiện chức năng này!"
                })
            }
        });
    }else {
        res.status(401).json(
          {
              code:401,
              success:false,
              message: "Bạn chưa đăng nhập!"
          }
        );
      }
}

const authMiddleWareUser = (req, res, next) => {
    const token = req.headers.token
    const userId = req.params.id
    if (token) {
        const accessToken = token.split(" ")[1];
    
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Token đã hết hạn hoặc không phải bạn!"
                })
            }
            if (user?.isAdmin || user?.id === userId) {
                next()
            } else {
            
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Bạn không có quyền thực hiện chức năng này!"
                })
            }
        });
    }else {
        res.status(401).json(
          {
              code:401,
              success:false,
              message: "Bạn chưa đăng nhập!"
          }
        );
      }
}
const authMiddleWareUserCart = (req, res, next) => {
    const token = req.headers.token
    const {user_id} = req.body
    if (token) {
        const accessToken = token.split(" ")[1];
    
        jwt.verify(accessToken, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Token đã hết hạn hoặc không phải bạn!"
                })
            }
            if (user?.isAdmin || user?.id === user_id) {
                next()
            } else {
          
                return res.status(401).json({
                    code:401,
                    success:false,
                    message: "Bạn không có quyền thực hiện chức năng này!"
                })
            }
        });
    }else {
        res.status(401).json(
          {
              code:401,
              success:false,
              message: "Bạn chưa đăng nhập!"
          }
        );
      }
}
const authMiddleWareToken = (req, res, next) => {
    //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          res.status(401).json({
            code:401,
            success:false,
            message: "Token đã hết hạn hoặc không phải bạn!"
          });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json(
        {
            code:401,
            success:false,
            message: "Bạn chưa đăng nhập!"
        }
      );
    }
  };

module.exports = {
    authMiddleWareAdmin,
    authMiddleWareUser,
    authMiddleWareToken,
    authMiddleWareUserCart
}