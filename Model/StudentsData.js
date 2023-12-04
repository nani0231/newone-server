const mongoose = require("mongoose");

const AddUsersData = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
  },
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

  BatchYear: {
    type: String,
    require: true,
  },
  SelectBatch: {
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
  Status: {
    type: String,
    require: true,
  },
  ExpiryDate: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("AddUsersData.data", AddUsersData);
