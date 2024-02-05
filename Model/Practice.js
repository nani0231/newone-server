const mongoose = require("mongoose");
// const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  tag: String,
  accesstype: String,
  accessplan: String,
  Practicetopic: [
    {
      topicName: String,
      topicdescription: String,
      Testtopic: [
        {
          testName: String,
          practiceType: String,
          questions: String,
          selectedSubject: [String],
          selectedChapters: [String],
          questionListMcq: [],
          questionListParag: [],
          questionListCoding:[]
        },
      ],
    },
  ],
  AccessDetails: [
    {
      InstituteName: {
        type: String,
      },
      BatchYear: {
        type: String,
      },
      Batch: [
        {
          type: String,
        },
      ],
      Access: {
        type: String,
      },
    },
  ],
});

const Practice = mongoose.model("Practice", categorySchema);

module.exports = Practice;