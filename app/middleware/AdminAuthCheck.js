const jwt = require('jsonwebtoken');

const AdminAuthCheck = (req, res, next) => {
   // 1. Get the token from all possible locations
   let token = req?.body?.token || req?.query?.token || req?.headers['x-access-token'] || req?.headers['authorization'];

   if (!token) {
       return res.status(400).json({
           status: false,
           message: 'Token is required for access this url'
       });
   }

  
   if (token.startsWith('Bearer ')) {
       token = token.split(' ')[1]; 
   }

   try {
       // 3. Verify the token
       const decoded = jwt.verify(token, process.env.JWT_SECRECT);
       req.admin = decoded;
   } catch (err) {
       return res.status(400).json({
           status: false,
           message: "invalid token"
       });
   }
   
   return next();
};

module.exports = AdminAuthCheck;