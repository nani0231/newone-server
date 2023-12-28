
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
// const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    tag: String,
    accesstype: String,
    accessplan: String, 
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
