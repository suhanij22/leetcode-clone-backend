const express= require("express");
const adminMiddleware= require("../middleware/adminMiddleware");
const videoRouter= express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo}= require("../controllers/videoSection");

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);
//we can fetch the video directly when ham problem ko fetch kar rhe hai-kyuki har problem ke liye there is one video only 
 
module.exports= videoRouter;