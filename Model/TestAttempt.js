
const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
    UserId: {type:String},
    AssessmentTestDetails:[{
        CategoryId:{type:String},
        AssessmentId:{type:String},
        QuestionsData:[],
        SubmittedAnswers:[],
        Score:{type:String},
        QualifingScale:[],
        SubmittedTime:{type:String}

    }]
 
})

const TextAttempt= mongoose.model("TextAttempt",productSchema);
module.exports = TextAttempt;