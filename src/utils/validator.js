const validator= require("validator");

//the data is present in form of object so Object.keys(data) converts it to array first 
const validate= (data)=>
{
    const mandatoryField= ['firstName','emailId','password'];
    const isAllowed= mandatoryField.every((key)=>Object.keys(data).includes(key)); //the data should have the mandatory fields mentioned above
    
    if(!isAllowed)
    {
        throw new Error("some field missing");
    }
    //validation
    if(!validator.isEmail(data.emailId))
    {
        throw new Error("invalid email");
    }
    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("password not strong");
    }
    
}

module.exports=validate;