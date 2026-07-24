const express= require("express");
const userMiddleware = require("../middleware/userMiddleware");
const {submitCode,runCode}= require("../controllers/userSubmission");
const submitCodeRateLimiter = require("../middleware/codeRateLimiter");
 
const submitRouter= express.Router();

submitRouter.post("/submit/:id",userMiddleware,submitCodeRateLimiter,submitCode); //id is the problem id which solution i have to submit
submitRouter.post("/run/:id",userMiddleware,runCode);

module.exports=submitRouter;