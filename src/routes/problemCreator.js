const express= require("express");

const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblem,submittedProblem}= require("../controllers/userProblem");
const userMiddleware= require("../middleware/userMiddleware"); 
//create
problemRouter.post('/create',adminMiddleware,createProblem);

//fetch 
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);

//update
problemRouter.put("/update/:id",adminMiddleware,updateProblem);  //only admin can edit the problem

//delete
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);  //only admin can delete the problem

//problems sovled by the user
problemRouter.get("/problemSolvedByUser/:id",userMiddleware,solvedProblem);

//get all submitted solution for a problem 
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);  //pid- problem id
module.exports= problemRouter;