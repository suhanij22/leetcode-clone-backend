const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageId,submitBatch,submitToken }= require("../utils/problemUtlilty");
const SolutionVideo= require("../models/solutionVideo");

const createProblem=async (req,res)=>{
    const {title,description, difficulty, tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}= req.body;

    try{
        for(const {language,completeCode} of referenceSolution)
        {
            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId= getLanguageId(language);      
            //creating a batch of different test cases
            const submissions= visibleTestCases.map((testcase)=>({
                source_code:completeCode, 
                language_id: languageId,
                stdin: testcase.input,
                expected_output:testcase.output

            })); 
            const submitResult= await submitBatch(submissions);  //have to send the submissions to judgeO
            
            const resultToken= submitResult.map((value)=>value.token);  //array of tokens will be created-->token for each batch that is created 

            const testResult= await submitToken(resultToken);
            for(const test of testResult)
            {
                if(test.status_id!=3){
                   return res.status(400).send("error occured");
                }
            }
        }

        //we have checked the problem and if its correct then we can store the solution in the database
        await Problem.create({
            ...req.body,
            problemCreator: req.result._id    //adminMiddleware has the result saved in the body that has admin info including admin's id
        });

        res.status(201).send("problem saved successfully");
    }
    catch(error){
    console.log(error);
    res.status(400).json({
        success: false,
        message: error.message
    });
}
}

const updateProblem= async (req,res)=>
{
    //we have to check if the problem that we have to update is correct or not
    const {id}= req.params;
    const {title,description, difficulty, tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}= req.body;

    try{
        if(!id)
        {
            return res.status(400).send("missing ID field");
        }
        const DsaProblem= await Problem.findById(id);
        if(!DsaProblem)
        {
            return res.status(404).send("Id is not present in the server");
        }

        for(const {language,completeCode} of referenceSolution)
        {
            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId= getLanguageId(language);      
            //creating a batch of different test cases
            const submissions= visibleTestCases.map((testcase)=>({
                source_code:completeCode, 
                language_id: languageId,
                stdin: testcase.input,
                expected_output:testcase.output

            })); 
            const submitResult= await submitBatch(submissions);  //have to send the submissions to judgeO
            
            const resultToken= submitResult.map((value)=>value.token);  //array of tokens will be created-->token for each batch that is created 

            const testResult= await submitToken(resultToken);
            
            for(const test of testResult)
            {
                if(test.status_id!=3){
                   return res.status(400).send("error occured");
                }
            }
        }

        const newProblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        res.status(200).send(newProblem);
    }
    catch(err)
    {
        res.status(404).send("error:"+err);
    }
}

const deleteProblem= async(req,res)=>{
    const {id}= req.params;
    try{
        if(!id)
        {
            return res.status(400).send("missing ID field");
        }
        const deletedProblem=await Problem.findByIdAndDelete(id);
        if(!deletedProblem)
        {
            return res.status(404).send("problem is missing");
        }
        res.status(200).send("successfully deleted the problem");
    }
    catch(err)
    {
        res.status(500).send("error:"+err);
    }
}

const getProblemById= async(req,res)=>
{
    const {id}= req.params;
    try{
        if(!id)
        {
            return res.status(400).send("missing ID field");
        }
        const getProblem= await  Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
        if(!getProblem)
        {
            return res.status(404).send("problem is missing");
        }

        //video ka url for editorial section ko fetch karna 
        const vidoes= await SolutionVideo.findOne({problemId:id});
        if(vidoes)
        {
            const responseData={
                ...getProblem.toObject(),
                secureUrl: vidoes.secureUrl,
                cloudinaryPublicId: vidoes.cloudinaryPublicId,
                thumbnailUrl: vidoes.thumbnailUrl,
                duration:vidoes.duration,
            }
            

            return res.status(200).send(responseData);
        }  
        //if videos nhi hai toh -zaruri nhi har problem ka video solution ho
       res.status(200).send(getProblem);
    }
    catch(err)
    {
        res.status(500).send("error:"+err);
    }
}

const getAllProblem= async(req,res)=>
{
    //to apply the feature of bringing only 10 problems per page
    try{
        const getProblem= await Problem.find({}).select('_id title difficulty tags');
        if(getProblem.length===0)
        {
            return res.status(404).send("problem is missing");
        }
        res.status(200).send(getProblem);

    }
    catch(err)
    {
        res.status(500).send("error:"+err); 
    }
}

const solvedProblem= async(req,res)=>{
    try{
        const count= req.result.problemSolved.length;
        const userId= req.result._id;
        const user= await User.findById(userId).populate({
            path: "problemSolved",
            select:"_id title difficulty tags"
        });

        res.status(200).send(user.problemSolved);
    }
    catch(err)
    {
        res.status(500).send("Server error");
    }
}

const submittedProblem= async(req,res)=>
{
    try
    {
        const problemId=req.params.pid;
        const userId= req.result._id;

        const ans= await Submission.find({userId,problemId});

        if(ans.length===0)
        {
            res.status(200).send([]);
        }
        res.status(200).send(ans);
    }
    catch(err)
    {
        res.status(500).send("internal server error:"+err);
    }
}

module.exports= {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedProblem,submittedProblem};