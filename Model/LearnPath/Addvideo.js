const mongoose = require("mongoose");

const AddvideoData = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
  },
  VideofolderName: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("AddvideoData.data", AddvideoData);
