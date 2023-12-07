const express = require("express");
const Chapter = require('../Model/Chapter');
const router =  express.Router()



// Create a new chapter (POST)
//http://localhost:4010/v1/chapter
router.post('/chapter', async (req, res) => {
    try {
      const newChapter = new Chapter(req.body);
      const savedChapter = await newChapter.save();
      res.json(savedChapter);
      // return res.json(await Chapter.find())
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
    // Read all chapters
    ////http://localhost:4010/v1/chapters
    router.get('/chapters', async (req, res) => {
      try {
        const chapters = await Chapter.find();
        res.status(200).json(chapters);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });
    
   // Get a specific chapter by ID (GET)
   //http://localhost:4010/v1/chapters/65703407efe6483c89c14829
  router.get('/chapters/:id', async (req, res) => {
    try {
      const chapter = await Chapter.findById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Update a chapter by ID (PUT)
  //http://localhost:4010/v1/chapter/65703407efe6483c89c14829
  router.put('/chapter/:id', async (req, res) => {
    try {
      const updatedChapter = await Chapter.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedChapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(updatedChapter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  //delete chapter
  //http://localhost:4010/v1/chapter/657033d7efe6483c89c14826
  router.delete("/chapter/:id", async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
  
      const data = await Chapter.deleteOne({ _id: id });
  
      if (data.deletedCount === 1) {
        res.send({ success: true, message: "Data deleted successfully", data });
      } else {
        res.status(404).send({ success: false, message: "Chapter not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Error deleting chapter", error: error.message });
    }
  });
  
  
  
  //fileter names
  router.get('/filter', async (req, res) => {
    try {
      const { name } = req.query;
      let filter = {};
  
      if (name) {
        filter.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive regex search
      }
  
      const subjects = await Chapter.find(filter);
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

//kumar


module.exports= router