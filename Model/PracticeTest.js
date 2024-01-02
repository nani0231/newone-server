const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Schema } = mongoose;

//Creating Schema For Pratice Test

const schemaData = new mongoose.Schema(
  {
    category: { type: String, required: true },
    topic: { type: String, required: true },
    testName: { type: String, required: true },
    practiceType: { type: String, required: true },
    questions: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const practiceTest = mongoose.model("practiceTest", schemaData);

module.exports = practiceTest;
