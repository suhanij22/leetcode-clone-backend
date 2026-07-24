const axios= require("axios"); 

const getLanguageId=(lang)=>
{
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }

    return language[lang.toLowerCase()];
}

const submitBatch=async (submissions)=>
{

    const options = {
    method: 'POST',
    url: 'https://ce.judge0.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        submissions
    }
    };

    async function fetchData(){
    try {
        const response = await axios.request(options);
        return response.data;
    }
    catch (error) {
    console.log(error.message);
    }
}

return await fetchData();
}

const waiting=(ms)=>
    new Promise(resolve=>setTimeout(resolve,ms));

const submitToken= async(resultToken)=>
{

    const options = {
    method: 'GET',
    url: 'https://ce.judge0.com/submissions/batch',
    params: {
        tokens: resultToken.join(","),  //as resultToken is an array and need to be converted into string with ,
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'Content-Type': 'application/json'
    }
    };

    async function fetchData(){
        try {
        const response = await axios.request(options);
        return response.data;
    } 
    catch (error) {
    console.log(error.message);
}
    }

    while(true){
        const result= await fetchData();
        const isResultObtained= result.submissions.every((r)=>r.status_id>2);
        if(isResultObtained)
        {
            return result.submissions;
        }
        await waiting(1000);  //to wait for 1 second 
    }
    

}

module.exports={getLanguageId,submitBatch ,submitToken};