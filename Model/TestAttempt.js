
const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
    UserId: {type:String},
    userdetails:[],
    CategoryId:{type:String},
    AssessmentId:{type:String},
    QuestionsData:[],
    SubmittedAnswers:[],
    Score:{type:String},
    QualifingScale:[],
    SubmittedTime:{type:String}, 
})

const TestAttempt= mongoose.model("TestAttempt",productSchema);
module.exports = TestAttempt;