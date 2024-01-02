const mongoose=require("mongoose")

const productSchema= new mongoose.Schema({
  Title: {
        type: String,
        require: true,
      },
      Tags: {
        type: String,
        require: true,
      },
      Author: {
        type: String,
        require: true,
      },
      Description: {
        type: String,
        require: true,
      },
      Image: {
        type: String,
        require: true,
      }, 
})

const Blogs=mongoose.model("Blogs",productSchema);
module.exports = Blogs;