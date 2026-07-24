const mongoose= require("mongoose");
const {Schema}= mongoose;

const submissionSchema= new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId:{
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['JavaScript','Python','C++','Java','C','TypeScript']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error','wrong answer'],
        default:'pending'
    },
    runtime:{
        type:Number,  //milliseconds
        default:0,
    },
    memory:{
        type:Number,
        default:0,
    },
    errorMessage:{
        type:String,
        default:'',
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    },
},
   { timestamps:true }
);

//compound indexing- done by arranging in ascending order using userid then problemid
submissionSchema.index({userId:1,problemId:1});   //indexing created using both userid and problemid

const Submission= mongoose.model('submission',submissionSchema);

module.exports= Submission;
