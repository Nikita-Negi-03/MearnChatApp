const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const auth = async (req,res, next) => {
    let token ;
    //console.log(req.headers)
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log("decode",decoded)

            req.user = await User.findById(decoded.id).select("-password");

            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed")
        }
    } else if(!token) {
        res.status(401);
        throw new Error("Not authorized, no token")
    }
}

module.exports = {auth}