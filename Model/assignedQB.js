const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    Name:{
        type:String,
        require:true
    },
    Description:{
        type:String,
        require:true
    },
    SubjectTag:{
        type:String,
        require:true
    }
})
const QbData=mongoose.model("assignedQB",schema);
module.exports=QbData;