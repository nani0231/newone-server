const mongoose=require("mongoose")

const SignupSchema= new mongoose.Schema({
  firstname: {
        type: String,
        require: true,
      },

      lastname: {
        type: String,
        require: true,
      },

      email: {
        type: String,
        require: true,
      },

      organizationname: {
        type: String,
        require: true,
      },

      mobilenumber: {
        type: String,
        require: true,
      }, 
      password: {
        type: String,
        require: true,
      },
   
})

const signupData=mongoose.model("SignupSchema",SignupSchema);
module.exports =  signupData;