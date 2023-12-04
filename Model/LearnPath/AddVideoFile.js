const mongoose = require("mongoose");

const videoFile = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
  },
  VideofolderName: {
    type: String,
    require: true,
  },
  VideoTitleName: {
    type: String,
    require: true,
  },
  SourceName: {
    type: String,
    require: true,
  },
  Video1: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("videoFile.data", videoFile);
