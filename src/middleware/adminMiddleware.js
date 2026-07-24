const jwt= require("jsonwebtoken");
const User=require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware= async(req,res,next)=>
{
    try{
        const {token}= req.cookies;
        if(!token)
        {
            throw new Error("Token not present");
        }
        //token valid hai bhi ya nhi 
        const payload= jwt.verify(token,process.env.JWT_KEY);
        const {_id}=payload;  //kyuki payload mein id aur email tha
        if(!_id)
        {
            throw new Error("Invalid token");
        }
        const result= await User.findById(_id);

        if(payload.role!='admin')  //agar admin nhi hua toh
        {
            throw new Error("Invalid token");
        }
        if(!result)
        {
            throw new Error("user doesnt exist");
        }
        //check agar vo token redis ki blocklist mei hai ki nhi 
        const isBlocked= await redisClient.exists(`token:${token}`);
        if(isBlocked)
            {
                throw new Error("invalid token");
            } 
        req.result=result;

        next();

    }
    catch(err)
    {
        res.status(503).send("error:"+err);
    } 
}

module.exports=adminMiddleware;