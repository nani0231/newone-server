const mongoose = require("mongoose");

const ByBatch = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
    required: true,
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
});

module.exports = mongoose.model("AddUserByBatch.data", ByBatch);
