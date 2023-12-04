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
});

module.exports = mongoose.model("AddInstituteData.data", AddInstituteData);
