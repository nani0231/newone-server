const mongoose=require("mongoose");
const MCQschema=new mongoose.Schema({
    Subjects:{
        type:String,
        require:true
    },
    Chapters:{
        type:String,
        require:true
    },
    Difficulty:{
        type:String,
        require:true
    },
    Reference:{
        type:String,
        require:true
    },
    Question:{
        type:String,
        require:true
    },
    questionImage:{
        type:String,
        require:true
    },
    Option1:{
        type:String,
        require:true
    },
    Option2:{
        type:String,
        require:true
    },
    Option3:{
        type:String,
        require:true
    }, 
     correctAnswer:{
        type:String,
        require:true
    },
    Explanation:{
        type:String,
        require:true
    },
    Image1:{
        type:String,
       
    },

})
const MCQ=mongoose.model("MCQ",MCQschema);
module.exports=MCQ;