const mongoose = require("mongoose");
// const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    tag: String,
    accesstype: String,
    accessplan: String, 
    AccessDetails:[
        {
          InstituteName:{
            type:String
          },
          BatchYear:{
            type:String
          },
          Batch:[{
            type:String
          }],
          Access:{
            type:String
          }
        },
    ]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;