const cloudinary= require('cloudinary').v2;
const Problem=require("../models/problem");
const User= require("../models/user");
const SolutionVideo=require("../models/solutionVideo");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const generateUploadSignature= async(req,res)=>{
    try{
        const {problemId}= req.params;
        const userId= req.result._id;
        //user is already checked through middleware of admin
        //verify problem exists 
        const problem= await Problem.findById(problemId);
        if(!problem)
        {
            return res.status(404).json({error:'problem not found'});
        }

        //generate unique public_id for the video
        const timestamp= Math.round(new Date().getTime()/1000);
        const publicId= `leetcode-solutions/${problemId}/${userId}_${timestamp}`; //different for every upload 

        const eagerTransformation = 'c_fill,h_225,w_400/q_auto/so_auto/jpg';

        //upload parameters
        const uploadParams= {
            timestamp:timestamp,
            public_id:publicId,
            eager: eagerTransformation
        };

        //generate Signature
        const signature= cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            public_id:publicId,
            eager: eagerTransformation,
            api_key:process.env.CLOUDINARY_API_KEY,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        });
    }
    catch(err)
    {
        console.error('error generating upload signature:',error);
        res.status(500).json({error:'failed to generate upload credentials'});
    }
};

const saveVideoMetadata= async(req,res)=>{
    try{
        const {problemId,cloudinaryPublicId,secureUrl,duration}=req.body;

        const userId= req.result._id;
        //verify the upload with cloudinary
        const cloudinaryResource= await cloudinary.api.resource(
            cloudinaryPublicId,
            {resource_type:'video'}
        );
        if(!cloudinaryResource)
        {
            return res.status(400).json({error:'video not found on cloudinary'});
        }

        //check if video already exists for this problem and user
        const existingVideo= await SolutionVideo.findOne({
            problemId,
            userId,
            cloudinaryPublicId
        });
        if(existingVideo)
        {
            return res.status(409).json({error:'video already exists'});
        }

        const thumbnailUrl =cloudinary.url(cloudinaryResource.public_id,{
            resource_type:'video',
            transformation:[
                {width:400, height:225,crop :'fill'},
                {quality:'auto'},
                {start_offset:'auto'}
            ],
            format:'jpg'
        });

        //create video solution record
        const videoSolution=await SolutionVideo.create({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration:cloudinaryResource.duration||duration,
            thumbnailUrl
        });

        res.status(201).json({
            message:'video solution saved successfully',
            videoSolution:{
                id:videoSolution._id,
                thumbnailUrl:videoSolution.thumbnailUrl,
                duration:videoSolution.duration,
                uploadedAt:videoSolution.createdAt
            }
        });
    }
    catch(err)
    {
        console.error('error saving video metadata:',err);
        res.status(500).json({error:'failed to save video metadata'});
    }
};

const deleteVideo= async(req,res)=>{
    try{
        const {problemId}= req.params;
        const userId= req.result._id;

        const video = await SolutionVideo.findOneAndDelete({problemId:problemId});

        if(!video)
        {
            return res.status(404).json({error:'video not found'});
        }
        await cloudinary.uploader.destroy(video.cloudinaryPublicId,{resource_type:'video',invalidate:true});  //delete from the cloudinary

        res.json({message:'video deleted successfully'});
    }
    catch(err)
    {
        console.error('error deleting video:',err);
        res.status(500).json({error:'failed to delete video'});
    }
};

module.exports={generateUploadSignature,saveVideoMetadata,deleteVideo};