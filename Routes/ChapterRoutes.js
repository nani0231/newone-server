const express = require("express");
const Subject= require("../Model/Subjects")
const router =  express.Router()

// Create a new chapter (POST)
//http://localhost:4010/v1/addchapter/65718fc0ac242c99efb6ea4b
router.post('/addchapter/:subjectId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const { Name, Description, subject, ChapterTag } = req.body;
  

    // Find the existing subject by ID
    const existingSubject = await Subject.findById(subjectId);

    if (!existingSubject) {
      return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
    }

    // Check if the chapter with the same name already exists
    const isChapterExist = existingSubject.chapter.some(
      (chapter) => chapter.Name === Name
    );

    if (isChapterExist) {
      return res.status(400).json({
        msg: 'Chapter with the same name already exists',
        status: 'failed',
      });
    }

    // Create a new chapter
    const newChapter = {
      Name,
      Description,
      subject,
      ChapterTag,
      MCQ: [] // Initialize MCQs as an empty array or with default values if needed
    };

    // Add the new chapter to the "chapter" array in the subject
    existingSubject.chapter.push(newChapter);

    // Save the updated subject document
    await existingSubject.save();

    return res.json({ msg: 'Chapter added successfully', status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});

    // Read  get all chapters 
    //http://localhost:4010/v1/getChapters/65718fc0ac242c99efb6ea4b
    router.get('/getChapters/:subjectId', async (req, res) => {
      try {
        const subjectId = req.params.subjectId;
    
        // Find the subject by ID
        const existingSubject = await Subject.findById(subjectId);
    
        if (!existingSubject) {
          return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
        }
    
        // Return the list of chapters for the subject
        const chapters = existingSubject.chapter;
    
        return res.json({ chapters, status: 'success' });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
      }
    });
    
    
    
 
  // Update a chapter by ID (PUT)
  //http://localhost:4010/v1/chapter/65703407efe6483c89c14829
  router.put('/updateChapter/:subjectId/:chapterId', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
      const { Name, Description, subject, ChapterTag } = req.body;
  
      // Find the existing subject by ID
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      // Find the specific chapter within the subject
      const chapterToUpdate = existingSubject.chapter.id(chapterId);
  
      if (!chapterToUpdate) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      // Update the chapter properties
      chapterToUpdate.Name = Name;
      chapterToUpdate.Description = Description;
      chapterToUpdate.subject = subject;
      chapterToUpdate.ChapterTag = ChapterTag;
  
      // Save the updated subject document
      await existingSubject.save();
  
      return res.json({ msg: 'Chapter updated successfully', status: 'success', updatedChapter: chapterToUpdate });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });
  
  //delete chapter
 // http://localhost:4010/v1/deleteChapter/65718fc0ac242c99efb6ea4b/65719d18570281262d5d0e31
  router.delete('/deleteChapter/:subjectId/:chapterId', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
  
      // Find the existing subject by ID
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      // Find the index of the chapter to be deleted
      const chapterIndex = existingSubject.chapter.findIndex(
        (chapter) => chapter._id.toString() === chapterId
      );
  
      if (chapterIndex === -1) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      // Remove the chapter from the "chapter" array
      existingSubject.chapter.splice(chapterIndex, 1);
  
      // Save the updated subject document
      await existingSubject.save();
  
      return res.json({ msg: 'Chapter deleted successfully', status: 'success' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });
  
  
  
  


//kumar


module.exports= router