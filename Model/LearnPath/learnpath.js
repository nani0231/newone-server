const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        learningPathTitle : {
            type : String
        },
        relevantSkillTags : {
            type:String
        },
        coverLetter : {
            type : String
        },
        difficultyLevel : {
            type : String
        },
        subscription: {
        type: String
        },
        price: {
        type: String
        },
        discount: {
        type: String
        },
        setAboutthislearningpath: {
          type: String
          },
        authorName : {
            type : String
        },
        minutes : {
            type : String
        },
        learningimg : {
            type : String
        },
        fileName : {
            type : String
        },
        requirements : {
            type : String
        },
        topics: [
            {
              topicName: {
                type: String,
              },
              description: {
                type: String,
              },
              publish: {
                type: String,
            },
            content: [
                {
                  contentTitle: {
                    type: String,
                  },
                  contentdes: {
                    type: String,
                  },
                  contentimg: {
                    type: String,
                  }, 
                  publish:{
                    type: String,
                  },         
        }]
        
    }]
    
    })

    const allLearningpaths = mongoose.model("allLearningpaths", productSchema);
    module.exports = allLearningpaths;