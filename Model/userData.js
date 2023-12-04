const mongoose = require("mongoose");

const userData = new mongoose.Schema({
  UserEmail: {
    type: String,
    require: true,
  },
  UserPassword: {
    type: String,
    require: true,
  },
});
//siva

module.exports = mongoose.model("userData.data", userData);
