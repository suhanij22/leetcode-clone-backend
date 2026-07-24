const redisClient= require("../config/redis");

const submitCodeRateLimiter= async(req,res,next)=>{
    const userId= req.result._id;
    const redisKey= `submit_cooldown:${userId}`;

    try{
        //check if user has a recent submission
        const exists= await redisClient.exists(redisKey);

        if(exists)
        {
            return res.status(429).json({
                error:'please wait 10 seconds before submitting again'
            });
        }

        //set cooldown period
        await redisClient.set(redisKey,'cooldown_active',{
            EX: 10, //expire after 10 seconds
            NX: true //only set if not exists
        });

        next();
    }
    catch(err)
    {
        console.log('rate limiter error:',err);
        res.status(500).send("error:"+err);
    }
}

module.exports= submitCodeRateLimiter;
