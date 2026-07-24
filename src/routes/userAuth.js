const express= require("express");
const {register,login,logout,adminRegister,deleteProfile}= require("../controllers/userAuthenticate");  
const authRouter=express.Router();
const userMiddleware=require("../middleware/userMiddleware");
const adminMiddleware=require("../middleware/adminMiddleware");
const { message } = require("statuses");

//Register- for user only
authRouter.post("/register",register);

//login
authRouter.post("/login",login);

//logout
authRouter.post("/logout",userMiddleware,logout);  

//getProfile
//authRouter.post("/getProfile",getProfile);

//register for admin- ek admin hi dusre admin ko register karwa sakta hai-->toh phele ek admin ko login karwao then admin register karwao naya wala
authRouter.post('/admin/register',adminMiddleware, adminRegister);

//user ko delete karna apna leetcode account
authRouter.delete("/profile",userMiddleware,deleteProfile);

authRouter.get('/check',userMiddleware,(req,res)=>
{
    const reply= {
        firstName:req.result.firstName,
        emailId: req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid user"
    })   
})
module.exports= authRouter;