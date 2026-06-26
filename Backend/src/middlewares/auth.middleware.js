const tokenBlackList = require("../models/tokenBlacklist.model")
const jwt = require("jsonwebtoken")

async function authUser(req,res,next) {

    token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "user not found"
        })
    }

    const userExists = tokenBlackList.findOne({token})

    if(userExists){
        return res.status(401).json({
            message : "Login Again"
        })
    }
    
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    }catch(err){
        
        return res.status(401).json({
            message : "invalid token"
        })
    }
}

module.exports = {authUser}