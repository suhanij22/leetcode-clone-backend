const redisClient = require("../config/redis");
const Submission = require("../models/submission");
const User= require("../models/user");
const validate=require("../utils/validator");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const register= async (req,res)=>{
    try{

        //validate the data
        validate(req.body);
         
        const {firstName,emailId,password}= req.body;

        //to hash the password that user has given 
        req.body.password= await bcrypt.hash(password,10);
        req.body.role= 'user'; 

        const user= await User.create(req.body);
    
        const reply= {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        //jab user ne register karliya toh usse token mil jayega direct ab
        const token= jwt.sign({_id:user._id, emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:3600}); 
        const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 3600 * 1000,
};

res.cookie("token", token, cookieOptions);  //maxAge is in milisecond

        res.status(201).json({
            user:reply,
            message:"user registered successfully"
        })
    }
    catch(err)
    {
        res.status(400).send("error:"+err);
    }
}

const login =async (req,res)=>
{
    try{
        const{emailId,password}= req.body;
        if(!emailId)
        {
            throw new Error("Invalid Credentials");
        }
        if(!password)
        {
            throw new Error("Invalid Credentials");
        }

        const user=await User.findOne({emailId});
        if(!user)
        {
            throw new Error("Invalid Credentials");
        }
        const match= await bcrypt.compare(password,user.password);
        if(!match)
        {
            throw new Error("Invalid Credentials");
        }
        
        const reply= {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }

        //agar koi direct login kar rha toh usse bhi token dena hoga
        const token= jwt.sign({_id:user._id, emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600}); 
       const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 3600 * 1000,
};

res.cookie("token", token, cookieOptions);

        res.status(200).json({
            user:reply,
            message:"login successfully"
        })
    }
    catch(err)
    {
        res.status(401).send("error:"+err);
    }
}

const logout = async(req,res)=>
{
    try{
        //validate the token-  middleware create  --->yeh routing ke time pe hi check ho jayega 
    
        //add token to the redis ke mein so it cant be used again
        const {token}=req.cookies;

        const payload=jwt.decode(token);
        await redisClient.set(`token:${token}`,payload.exp);
        //cookies ko phir waha se clear kar denge
        res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
});
        res.send("logged out successfully");

    }  
    catch(err)
    {
        res.status(401).send("error:"+err);
    }
}

const adminRegister=async (req,res)=>
{
    try{

        //validate the data
        validate(req.body);
         
        const {firstName,emailId,password}= req.body;

        //to hash the password that user has given 
        req.body.password= await bcrypt.hash(password,10);

        const user= await User.create(req.body);
    
        //jab user ne register karliya toh usse token mil jayega direct ab
        const token= jwt.sign({_id:user._id, emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600}); 
        const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 3600 * 1000,
};

res.cookie("token", token, cookieOptions);  //maxAge is in milisecond

        res.status(201).send("user Registered successfully");
    }
    catch(err)
    {
        res.status(400).send("error:"+err);
    }
}

const deleteProfile=async(req,res)=>{
    try{
        const userId= req.result._id;

        //userSchema delete
        await User.findByIdAndDelete(userId);

        //submission bhi delete karna padega uss user ke jitne bhi hai 
        await Submission.deleteMany({userId});

        res.status(200).send("deleted successfully");
    }
    catch(err)
    {
        res.status(500).send("server error:"+err);
    }
}

module.exports= {register,login,logout,adminRegister,deleteProfile };