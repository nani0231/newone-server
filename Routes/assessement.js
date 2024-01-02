const express = require("express");
const assessment= require("../Model/Assessment/Assessment")
const router =  express.Router()
router.post("/assessment", async (req, res) => {
    try {
      const {
        category,
        assessmentname,
        nooftimes,
        assessmentpassword,
        exametype,
        cutofftype,
        questionselection,
        assessmentreport,
        assessmentflow,
        assessmentadaptiveness} = req.body;
        let newUser = new assessment({
          category:category,
          assessmentname:assessmentname,
          nooftimes:nooftimes,
          assessmentpassword:assessmentpassword,
          exametype:exametype,
          cutofftype:cutofftype,
          questionselection:questionselection,
          assessmentreport:assessmentreport,
          assessmentflow:assessmentflow,
          assessmentadaptiveness:assessmentadaptiveness
        });
  
        // const isUserExist = await assessment.findOne({ '':'' });
  
        // if (isUserExist) {
        //   return res.status(400).json("User already registered");
        // }
      newUser.save();
  
       return res.status(200).json("User created successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal server error");
    }
  });
router.get("/allassessment", async (req, res) => {
  
    const allusers1 = await assessment.find({})
    res.status(200).send(allusers1)
  });
  // router.post("/addqustion/:learningPathId",  async (req, res) => {
  //   try {
  //     const learningPathId = req.params.learningPathId;
  //     const { qustioncount, totalqustion, duration,percentage,modelname,maxmarks } = req.body;
  
  //     // Find the existing learning path by ID
  //     const existingLearningPath = await assessment.findById(
  //       learningPathId
  //     );
  
  //     if (!existingLearningPath) {
  //       return res
  //         .status(404)
  //         .json({ msg: "Learning path not found", status: "failed" });
  //     }
  
  //     // Check if the topic with the same name already exists
    
  
  //     let newTopic = new assessment({
  //       qustioncount:qustioncount,
  //       totalqustion:totalqustion,
  //       duration:duration,
  //       percentage:percentage,
  //       modelname:modelname,
  //       maxmarks:maxmarks
  //     });
     
  //      newTopic.save();
  //     return res.status(200).json("User created successfully");
  //   } catch (e) {
  //     console.error(e.message);
  //     return res
  //       .status(500).json({ msg: "Internal Server Error", status: "failed" });
  //   }
  // });
  // router.post("/addquestion/category", async (req, res) => {
  //   try {
  //     const category= req.params.category;
  //     const { questioncount, totalqustion, duration, percentage, modelname, maxmarks } = req.body;
  
  //     // Find the existing learning path by ID
  //     const existingqustionPath = await assessment.findById(category);
  
  //     if (!existingqustionPath) {
  //       return res.status(404).json({ success: false, msg: "Qustion path not found" });
  //     }
  
  //     // Add the new question to the existing learning path
  //     existingqustionPath.Qustions.push({
  //       questioncount,
  //       totalqustion,
  //       duration,
  //       percentage,
  //       modelname,
  //       maxmarks,
  //     });
  
  //     // Save the updated learning path
  //     await existingqustionPath.save();
  
  //     return res.status(200).json({ success: true, msg: "Question added successfully" });
  //   } catch (e) {
  //     console.error(e.message);
  //     return res.status(500).json({ success: false, msg: "Internal Server Error" });
  //   }
  // });
  router.post("/addquestion/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const { qustioncount, totalquestion, duration, percentage, modelname, maxmarks } = req.body;

        // Find the existing learning path by category
        const existingquestionPath = await assessment.findOne({ category: category });

        if (!existingquestionPath) {
            return res.status(404).json({ success: false, msg: "Question path not found" });
        }

        // Add the new question to the existing learning path
        existingquestionPath.Qustions.push({
          qustioncount,
            totalquestion,
            duration,
            percentage,
            modelname,
            maxmarks,
        });

        // Save the updated learning path
        await existingquestionPath.save();

        return res.status(200).json({ success: true, msg: "Question added successfully" });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
});
  router.get("/alladdquestion/:id", async (req, res) => {
    try {
      const _id = req.params.id;
  
      // Find the question by ID
      const question = await assessment.findById(_id);
  
      if (!question) {
        return res.status(404).json({ msg: "Question not found", status: "failed" });
      }
  
      // If the question is found, send it in the response
      return res.send(question);
    } catch (e) {
      console.error(e.message, "addquestion");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  });
  router.get("/alladdquestion1/:category", async (req, res) => {
    try {
      const category = req.params.category;
  
      // Check if the provided InstituteName exists
      const FolderData = await assessment.find({ category });
  
      if (!FolderData) {
        return res.status(404).json("InstituteName not found");
      }
  
      // Return the data for the specified InstituteName
      return res.status(200).json(FolderData);
    } catch (e) {
      console.error(e.message, "foldersVideoData");
      return res.status(500).json(e.message);
    }
  });
  router.post("/assessmentsettings/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const { Enable,Restrict,Tab,assessmentTabs} = req.body;

        // Find the existing learning path by category
        const existingquestionPath = await assessment.findOne({ category: category });

        if (!existingquestionPath) {
            return res.status(404).json({ success: false, msg: "assessmentsettings path not found" });
        }

        // Add the new question to the existing learning path
        existingquestionPath.Assessmentsettings.push({
          Enable,
          Restrict,
          Tab,
          assessmentTabs
        });

        // Save the updated learning path
        await existingquestionPath.save();

        return res.status(200).json({ success: true, msg: "assessmentsettings added successfully" });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
});
  module.exports = router;