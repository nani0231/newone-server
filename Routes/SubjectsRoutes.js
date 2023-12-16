const express = require("express");
const Subject = require('../Model/Subjects');
const router =  express.Router()
// Create a subject
//http://localhost:4010/v2/subject
router.post('/subject', async (req, res) => {
    try {
      const newSubject = new Subject(req.body);
      await newSubject.save();
      //res.status(201).json(newSubject);
      return res.status(200).json({message:" create subjects Success"})
    //   return res.json(await Subject.find())
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  // Get all subjects
  http://localhost:4010/v2/subjects
router.get('/subjects', async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.json(subjects);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  // Update a subject
  //http://localhost:4010/v2/subject/65703804dcc1f80c4441e4be
  router.put('/subject/:id', async (req, res) => {
    const { id } = req.params; 
    const { name, description, subjectTag } = req.body; 
    try {
      // Find the subject by ID and update its fields
      const updatedSubject = await Subject.findOneAndUpdate(
        { _id: id },
        { name, description, subjectTag },
        { new: true } 
      );
  
      if (!updatedSubject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Respond with the updated subject
      return res.status(200).json(updatedSubject);
    } catch (error) {
      // Handle errors
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
//Delete a subject
//http://localhost:4010/v2/subjet/657039965dd4899d304ac058
router.delete("/subjet/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Subject.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.send({ success: true, message: "Data deleted successfully", data: result });
    } else {
      res.status(404).send({ success: false, message: "Subject not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error deleting subject", error: error.message });
  }
});




//fileter names
//http://localhost:4010/v2//filter?name=Mathematics
router.get('/filter', async (req, res) => {
    try {
      const { name } = req.query;
      let filter = {};
  
      if (name) {
        filter.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive regex search
      }
  
      const subjects = await Subject.find(filter);
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
//kumar
  module.exports= router