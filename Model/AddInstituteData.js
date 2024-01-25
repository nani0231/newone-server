const mongoose = require("mongoose");
const AddInstituteData = new mongoose.Schema({
  
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
  AccessPlans: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  currentTime: {
    type: String,
    require: true,
  },
  
  listDataAccess:[
    {
      aboveData:String,
      institutionpara: String,
      InstituteType: String,
      AxiosPlans: String,
    }
  ],
  InstituteBatchYear: [
    {
      BatchYear: {
        type: String,
      },
      InsituteBatch: [
        {
          Batch: {
            type: String,
          },
          Access:{
            type: String,
          },
          LearningPathAccess:{
            type:String,
          },
          InstituteUsersList: [
            {
              Regdid: {
                type: String,
                require: true,
              },
              FirstName: {
                type: String,
                require: true,
              },
              LastName: {
                type: String,
                require: true,
              },

              userEmail: {
                type: String,
                require: true,
              },
              userNumber: {
                type: String,
                require: true,
              },

              AccessPlans: {
                type: String,
                require: true,
              },
              Password: {
                type: String,
                require: true,
              },
              Status: {
                type: String,
                require: true,
              },
              ExpiryDate: {
                type: String,
                require: true,
              },
              currentTime: {
                type: String,
                require: true,
              },
            },
          ],
          ExtendUsersAccess:[
           { AccessPlans:{
              type:String,
            },
            Access:{
              type:String,
            },
          },
          ]
            },
      ],
    },
  ],
});

 module.exports = mongoose.model("AddInstituteData", AddInstituteData);