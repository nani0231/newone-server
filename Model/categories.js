

// const mongoose = require("mongoose");
// // const { Schema } = mongoose;

// const categorySchema = new mongoose.Schema({
//     Name: String,
//     Description: String,
//     Tag: String,
//     Accesstype: String,
//     Accessplan: String, 
// });

// const Category = mongoose.model("Category", categorySchema);

// module.exports = Category;




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
    }

})

const Categories = mongoose.model("categories", Allcategories);

module.exports = Categories;

