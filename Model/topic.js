const mongoose = require("mongoose");

const Topics = new mongoose.Schema({
    category: {
        type: String,
        required : true,
    },
    name: {
        type: String,
        required : true,
    },
    description: {
        type: String,
        required : true,
    },
    

})

const Topic = mongoose.model("topic", Topics);

module.exports = Topic;