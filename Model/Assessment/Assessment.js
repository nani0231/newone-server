const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
  category: {
        type: String,
        require: true,
      },
      assessmentname: {
        type: String,
        require: true,
      },
      nooftimes: {
        type: String,
        require: true,
      },
      assessmentpassword: {
        type: String,
        require: true,
      },
      exametype: {
        type: String,
        require: true,
      },
      cutofftype: {
        type: String,
        require: true,
      },
      questionselection: {
        type: String,
        require: true,
      },
      assessmentreport: {
        type: String,
        require: true,
      },
      assessmentflow: {
        type: String,
        require: true,
      },
      assessmentadaptiveness: {
        type: String,
        require: true,
      },
      Qustions: [
        {
          qustioncount: {
            type: String,
          },
          totalqustion: {
            type: String,
          },
         duration: {
            type: String,
        },
       percentage: {
          type: String,
      },
      modelname: {
        type: String,
    },
  maxmarks: {
    type: String,
},
 }],
 Assessmentsettings: [
  {
    Enable:{
      type: String,
    },
    Restrict: {
      type: String,
    },
    Tab: {
      type: String,
    },
    assessmentTabs: {
      type: String,
    },
  
}]
     
   
})

const assessment=mongoose.model("assessment",productSchema);
module.exports = assessment;