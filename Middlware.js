const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    try{
        let token = req.header("token")
         
        if(!token){
             return res.status(400).json("jwt token not found")
        }
        let compareToken = jwt.verify(token,"jwtpassword"); 
        req.user = compareToken.user;//compare req user and loggged user
        next();
    }catch(e){
        console.log(e)
        return resizeBy.status(500).json("Internal server error")
    }
}