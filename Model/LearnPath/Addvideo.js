const mongoose = require("mongoose");

const AddvideoData = new mongoose.Schema({

  VideofolderName: {
    type: String,
    require: true,
  },
   videoFile : [{
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
}]
})

module.exports = mongoose.model("AddvideoData.data", AddvideoData);
