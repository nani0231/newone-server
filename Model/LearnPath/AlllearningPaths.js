// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   learningPathTitle: {
//     type: String,
//   },
//   relevantSkillTags: {
//     type: String,
//   },
//   coverLetter: {
//     type: String,
//   },
//   difficultyLevel: {
//     type: String,
//   },
//   subscription: {
//     type: String,
//   },
//   price: {
//     type: String,
//   },
//   discount: {
//     type: String,
//   },
//   AboutLearnPath: {
//     type: String,
//   },
//   authorName: {
//     type: String,
//   },
//   hours: {
//     type: String,
//   },
//   minutes: {
//     type: String,
//   },
//   learningimg: {
//     type: String,
//   },
//   fileName: {
//     type: String,
//   },
//   requirements: {
//     type: String,
//   },
//   CurrentTime: {
//     type: String,
//   },
//   topics: [
//     {
//       topicName: {
//         type: String,
//       },
//       description: {
//         type: String,
//       },
//       publish: {
//         type: String,
//       },
//       TopicTime: {
//         type: String,
//       },
//       content: [
//         {
//           contentTitle: {
//             type: String,
//           },
//           contentdes: {
//             type: String,
//           },
//           contentimg: {
//             type: String,
//           },
//           publish: {
//             type: String,
//           },
//           contentTime: {
//             type: String,
//           },
//         },
//       ],
//     },
//   ],
// });

// const allLearningPaths = mongoose.model("allLearningPaths", productSchema);
// module.exports = allLearningPaths;



const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  learningPathTitle: {
    type: String,
  },
  relevantSkillTags: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  difficultyLevel: {
    type: String,
  },
  subscription: {
    type: String,
  },
  price: {
    type: String,
  },
  discount: {
    type: String,
  },
  AboutLearnPath: {
    type: String,
  },
  authorName: {
    type: String,
  },
  hours: {
    type: String,
  },
  minutes: {
    type: String,
  },
  learningimg: {
    type: String,
  },
  fileName: {
    type: String,
  },
  requirements: {
    type: String,
  },
  CurrentTime: {
    type: String,
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
      TopicTime: {
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
          publish: {
            type: String,
          },
          contentTime: {
            type: String,
          },

          question:[
            {
              question: {
                type: String,
                required: true,
              },
            }
          ]
        },
        
      ],  
    },
  ],
});

const allLearningPaths = mongoose.model("allLearningPaths", productSchema);
module.exports = allLearningPaths;