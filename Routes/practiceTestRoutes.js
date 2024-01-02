const express = require("express");
const practiceTest = require("../Model/PracticeTest");
const router = express.Router();

router.post("/practiceTest", async (req, res) => {
  try {
    const newPracticeTest = new practiceTest(req.body);
    await newPracticeTest.save();
    // res.status(201).json(newPracticeTest);
    return res
      .status(200)
      .json({ message: "Practice Test Created Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Can not post Practice Test" });
  }
});

// To get all practiceTests
router.get("/getAllPracticeTest", async (req, res) => {
  try {
    const practiceTests = await practiceTest.find();
    res.json(practiceTests);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in getting all practice test data" });
  }
});

//Updating the Practice Test
router.put("/practiceTest/:id", async (req, res) => {
  const { id } = req.params;
  const { category, topic, testName, practiceType, questions } = req.body;
  try {
    const updatedPracticeTest = await practiceTest.findOneAndUpdate(
      { _id: id },
      {
        category,
        topic,
        testName,
        practiceType,
        questions,
      },
      { new: true }
    );
    if (!updatedPracticeTest) {
      return res.status(404).json({ message: "Practice Test is not Found" });
    }
    return res.status(200).json(updatedPracticeTest);
  } catch (error) {
    return res
      .status(500)
      .json({ messgae: "Can Not Update the Practice Test" });
  }
});

//To delete the Practice Test
router.delete("/deletePracticeTest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await practiceTest.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.send({
        success: true,
        message: "Practice Test Deleted Successfully",
      });
    } else {
      res
        .status(404)
        .send({ success: false, message: "Practice Test Not Found" });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Practice Test",
      error: error.message,
    });
  }
});

router.get("/getSinglePracticeTest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const singlePracticeTest = await practiceTest.findById({ _id: id });
    res.send(singlePracticeTest);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
