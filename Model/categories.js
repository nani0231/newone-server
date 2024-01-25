const mongoose = require("mongoose");

const Allcategories = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  accesstype: {
    type: String,
    required: true,
  },
  accessplan: {
    type: String,
    required: true,
  },
  display: {
    type: String,
    required: true,
  },
  AccessDetails: [
    {
      InstituteName: {
        type: String
      },
      BatchYear: {
        type: String
      },
      Batch: [{
        type: String
      }],
      Access: {
        type: String
      }
    },
  ],
  Assessment: [
    {
      assessmentname: {
        type: String,
        require: true,
      },
      nooftimes: {
        type: String,
        require: true,
      },
      assessmentpassword: {
        type: String,
        require: true,
      },
      exametype: {
        type: String,
        require: true,
      },
      cutofftype: {
        type: String,
        require: true,
      },
      questionselection: {
        type: String,
        require: true,
      },
      assessmentreport: {
        type: String,
        require: true,
      },
      assessmentflow: {
        type: String,
        require: true,
      },
      assessmentadaptiveness: {
        type: String,
        require: true,
      },
      Qustionscount: [
        {
          qustioncount: {
            type: String,
          },
          totalqustion: {
            type: String,
          },
          duration: {
            type: String,
          },
          percentage: {
            type: String,
          },
          modelname: {
            type: String,
          },
          maxmarks: {
            type: String,
          },
        }],
      Assessmentsettings: [
        {
          Enable: {
            type: String,
          },
          Restrict: {
            type: String,
          },
          Tab: {
            type: String,
          },
          assessmentTabs: {
            type: String,
          },

        }],
      Questions: []
    }
  ]

})

const Categories = mongoose.model("categories", Allcategories);

module.exports = Categories;