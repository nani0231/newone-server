const mongoose = require("mongoose");

const ByList = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
  },
  aboveData: {
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
  institutionpara: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("AddUserByList.data", ByList);
