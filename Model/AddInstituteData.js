const mongoose = require("mongoose");

const AddInstituteData = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
  },
  InstituteName: {
    type: String,
    require: true,
  },
  HeadName: {
    type: String,
    require: true,
  },
  PrimaryEmail: {
    type: String,
    require: true,
  },
  PrimaryContactNumber: {
    type: String,
    require: true,
  },
  SecondaryEmail: {
    type: String,
    require: true,
  },
  SecondaryContactNumber: {
    type: String,
    require: true,
  },
  BatchYear: {
    type: String,
    require: true,
  },
  SelectBatch: {
    type: String,
    require: true,
  },
  Address: {
    type: String,
    require: true,
  },
  City: {
    type: String,
    require: true,
  },
  InstituteCode: {
    type: String,
    require: true,
  },
  InstituteType: {
    type: String,
    require: true,
  },
  AxiosPlans: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Access :{
    type: String,
  }
});

module.exports = mongoose.model("AddInstituteData.data", AddInstituteData);

   
// const mongoose = require("mongoose");
// const AddInstituteData = new mongoose.Schema({
//   Sno: {
//     type: String,
//     default: null,
//     unique: true,
//   },
//   InstituteName: {
//     type: String,
//     require: true,
//   },
//   HeadName: {
//     type: String,
//     require: true,
//   },
//   PrimaryEmail: {
//     type: String,
//     require: true,
//   },
//   PrimaryContactNumber: {
//     type: String,
//     require: true,
//   },
//   SecondaryEmail: {
//     type: String,
//     require: true,
//   },
//   SecondaryContactNumber: {
//     type: String,
//     require: true,
//   },

//   Address: {
//     type: String,
//     require: true,
//   },
//   City: {
//     type: String,
//     require: true,
//   },
//   InstituteCode: {
//     type: String,
//     require: true,
//   },
//   InstituteType: {
//     type: String,
//     require: true,
//   },
//   AxiosPlans: {
//     type: String,
//     require: true,
//   },
//   Password: {
//     type: String,
//     require: true,
//   },
//   InstituteBatchYear: [
//     {
//       BatchYear: {
//         type: String,
//       },
//       InsituteBatch: [
//         {
//           Batch: {
//             type: String,
//           },
//           InstituteUsersList: [
//             {
//               Regdid: {
//                 type: String,
//                 require: true,
//               },
//               FirstName: {
//                 type: String,
//                 require: true,
//               },
//               LastName: {
//                 type: String,
//                 require: true,
//               },

//               userEmail: {
//                 type: String,
//                 require: true,
//               },
//               userNumber: {
//                 type: String,
//                 require: true,
//               },

//               AxiosPlans: {
//                 type: String,
//                 require: true,
//               },
//               Password: {
//                 type: String,
//                 require: true,
//               },
//               Status: {
//                 type: String,
//                 require: true,
//               },
//               ExpiryDate: {
//                 type: String,
//                 require: true,
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });

//  module.exports = mongoose.model("AddInstituteData.data", AddInstituteData);
  
//  const mongoose = require("mongoose");

//  const productSchema = new mongoose.Schema({
//    learningPathTitle: {
//      type: String,
//    },
//    relevantSkillTags: {
//      type: String,
//    },
//    coverLetter: {
//      type: String,
//    },
//    difficultyLevel: {
//      type: String,
//    },
//    subscription: {
//      type: String,
//    },
//    price: {
//      type: String,
//    },
//    discount: {
//      type: String,
//    },
//    AboutLearnPath: {
//      type: String,
//    },
//    authorName: {
//      type: String,
//    },
//    hours: {
//      type: String,
//    },
//    minutes: {
//      type: String,
//    },
//    learningimg: {
//      type: String,
//    },
//    fileName: {
//      type: String,
//    },
//    requirements: {
//      type: String,
//    },
//    CurrentTime: {
//      type: String,
//    },
//    topics: [
//      {
//        topicName: {
//          type: String,
//        },
//        description: {
//          type: String,
//        },
//        publish: {
//          type: String,
//        },
//        TopicTime: {
//          type: String,
//        },
//        content: [
//          {
//            contentTitle: {
//              type: String,
//            },
//            contentdes: {
//              type: String,
//            },
//            contentimg: {
//              type: String,
//            },
//            publish: {
//              type: String,
//            },
//            contentTime: {
//              type: String,
//            },
//          },
//        ],
//      },
//    ],
//  });
 
//  const allLearningPaths = mongoose.model("allLearningPaths", productSchema);
//  module.exports = allLearningPaths;

