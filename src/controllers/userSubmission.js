
const Problem = require("../models/problem");
const Submission=require("../models/submission");
const { getLanguageId, submitBatch, submitToken } = require("../utils/problemUtlilty");

const submitCode= async(req,res)=>
{
    try{
        const userId= req.result._id;
        const problemId= req.params.id;

        const {code,language}=req.body;

        if(!userId||!code||!problemId||!language)
        {
            return res.status(400).send("some field missing");
        }
        //fetch the problem from database
        const problem =await Problem.findById(problemId);
         
        const submittedResult= await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length,
        })
        //judge0 code ko submit karna hai
        const languageId= getLanguageId(language);
        //batch creation for each hidden test cases
        const submissions= problem.hiddenTestCases.map((testcase)=>(
        {
            source_code: code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output: testcase.output
        }));
        const submitResult=await submitBatch(submissions);
        const resultToken= submitResult.map((value)=>value.token);  //array is created of token of each batch
        const testResult =await submitToken(resultToken);

        //submittedResult ko update karna
        let testCasesPassed= 0;
        let runtime=0;
        let memory=0;
        let status= 'accepted';
        let errorMessage=null;
        for(const test of testResult)
        {
            if(test.status_id===3)
            {
                testCasesPassed++;
                runtime+= parseFloat(test.time);
                memory= Math.max(memory,test.memory);
            }
            else
            {
                if(test.status_id===4)
                {
                    status='wrong answer';
                    errorMessage=test.stderr;
                }
                else{
                    status= 'wrong';
                    errorMessage=test.stderr;     
                }
            }
        }

        submittedResult.status=status;
        submittedResult.testCasesPassed=testCasesPassed;
        submittedResult.errorMessage=errorMessage;
        submittedResult.runtime=runtime;
        submittedResult.memory=memory;

        await submittedResult.save();  //in the create thing it gets save automatically

        //res.status(201).send(submittedResult);

        //problemid ko insert karenge userschema ke problemsolved mein if its not there
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted= (status=='accepted')
        res.status(201).json({
            accepted,
            totalTestCases: submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });

    }
    catch (err) {
    console.error("internal error:",err);
}
}

const runCode= async(req,res)=>
{
    try{
        const userId= req.result._id;
        const problemId= req.params.id;

        const {code,language}=req.body;

        if(!userId||!code||!problemId||!language)
        {
            return res.status(400).send("some field missing");
        }
        //fetch the problem from database
        const problem =await Problem.findById(problemId);
         
        //judge0 code ko submit karna hai
        const languageId= getLanguageId(language);
        //batch creation for each hidden test cases
        const submissions= problem.visibleTestCases.map((testcase)=>(
        {
            source_code: code,
            language_id:languageId,
            stdin:testcase.input,
            expected_output: testcase.output
        }));
        const submitResult=await submitBatch(submissions);
        const resultToken= submitResult.map((value)=>value.token);  //array is created of token of each batch
        const testResult =await submitToken(resultToken);
        
        res.status(201).send(testResult);
    }
    catch(err)
    {
        res.status(500).send("internal server error:"+err);
    }
}

module.exports= {submitCode,runCode};  