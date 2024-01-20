const mongoose = require("mongoose");

const Allcategories = new mongoose.Schema({
    name: {
        type: String,
        required : true,
    },
    description: {
        type: String,
        required : true,
    },
    tag: {
        type: String,
        required : true,
    },
    accesstype: {
        type: String,
        required : true,
    },
    accessplan : {
        type: String,
        required : true,
    },
    display: {
        type : String,
        required: true,
    },
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

})

const Categories = mongoose.model("categories", Allcategories);

module.exports = Categories;

