const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  subjectTag: { type: String, required: true },
  chapter: [
    {
      Name: {
        type: String,
        required: true,
      },
      Description: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
      },
      ChapterTag: {
        type: String,
      },

      MCQ: [
        {
          selectquestiontype: {
            type: String,
          },
          Subjects: {
            type: String,
            require: true,
          },
          Chapters: {
            type: String,
            require: true,
          },
          Difficulty: {
            type: String,
            require: true,
          },
          Reference: {
            type: String,
            require: true,
          },
          Question: {
            type: String,
            require: true,
          },
          questionImage: {
            type: String,
            require: true,
          },
          Option1: {
            type: String,
            require: true,
          },
          Option2: {
            type: String,
            require: true,
          },
          Option3: {
            type: String,
            require: true,
          },
          correctAnswer: {
            type: String,
            require: true,
          },
          Explanation: {
            type: String,
            require: true,
          },
        },
      ],
     paragMCQ: [
        {
          
          Subjects: {
            type: String,
            require: true,
          },
          Chapters: {
            type: String,
            require: true,
          },
          Difficulty: {
            type: String,
            require: true,
          },
          Reference: {
            type: String,
           
          },
          Question: {
            type: String,
            require: true,
          },
          questionImage:{
            type:String
          }
        
        },
      ],
     codingbasic:[
      {
        Subjects: {
            type: String,
            require: true,
          },
          Chapters: {
            type: String,
            require: true,
          },
          Title:{
            type:String,

          },
          Programminglanguage:{
            type:String,
            
          },
          Description:{
            type:String,
            required:true,
          },
          Constraints:{
            type:String,
            required:true,
            
          },
          
      }
     ]

    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
