const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  chapterTag: {
    type: String,
    required: true,
  },
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
