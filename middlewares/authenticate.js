const jwt = require('jsonwebtoken');
const {  Unauthorized } = require('http-errors')

const { User } = require('../model/user');

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {

    try {
        const { authorization } = req.headers;
        // console.log(authorization);
    if (!authorization) {
        throw new Unauthorized('Not authorized');
    }

        const  [bearer, token ] = authorization.split(" ");
        // console.log('bearer',bearer);
    if (bearer !== "Bearer") {
      throw new Unauthorized('Not aauthorized');  
    }
        
             jwt.verify(token, SECRET_KEY);
        const user = await User.findOne({ token });
        
            if (!user) {
              throw new Unauthorized('Not aaauthorized');   
            }
        req.user = user;
        console.log('user',req.user);
            next();

      
        
    } catch (error) {
        if (!error.status) {
            error.status = 401;
            error.message = 'Not eauthorized';
        }
        next(error);
    }

   
   
}

module.exports = {
    authenticate
};