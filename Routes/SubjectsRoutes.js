const express = require("express");
const Subject = require("../Model/Subject")
const router =  express.Router()
// Create a subject
//http://localhost:4010/v2/subject
router.post('/subject', async (req, res) => {
    try {
      const newSubject = new Subject(req.body);
      await newSubject.save();
      //res.status(201).json(newSubject);
      return res.status(201).json({message:" create subjects Success"})
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
      console.log(req.body,"sai")
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
  
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      // Update the subject properties
      subject.name = name;
      subject.Description = Description;
      subject.subjectTag = subjectTag;
  
      // Save the updated subject
      await subject.save();
  
      res.json({ msg: 'Subject updated successfully', status: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error', status: 'failed' });
    }
  });
//Delete a subject
//http://localhost:4010/v2/subjet/657039965dd4899d304ac058
router.delete('/subjects/:subjectId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;

    // Use deleteOne to remove the subject and its associated data by subject ID
    const result = await Subject.deleteOne({ _id: subjectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    return res.json({ message: 'Subject and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



//kumar
  module.exports= router