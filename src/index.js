const express=require("express");
const app= express();
require("dotenv").config();
const main= require("./config/database");
const cookieParser= require("cookie-parser");
const authRouter= require("./routes/userAuth");
const redisClient = require("./config/redis");
const problemRouter= require("./routes/problemCreator");
const submitRouter= require("./routes/submit");
const cors= require('cors');
const aiRouter= require("./routes/aichat");
const videoRouter= require("./routes/videoCreator");

//if '*' given means the data can be accessed by anyone
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://leetcode-clone-frontend-mu.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const initializeConnection= async()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("connected to DB");
        const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
    }
    catch(err)
    {
        console.log("error:"+err);
    }
}
   
initializeConnection();