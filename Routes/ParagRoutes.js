const express = require("express");
const Subject= require("../Model/Subjects")
const router =  express.Router()
// routes/paragMCQ.js create
//http://localhost:4010/v2/addparaMcq/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c
router.post('/addparaMcq/:subjectId/:chapterId/', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
      const {
        Subjects,
        Chapters,
        Difficulty,
        Reference,
        Question,
        questionImage,
      } = req.body;
  
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      const chapter = existingSubject.chapter.id(chapterId);
  
      if (!chapter) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      const newParagMCQ = {
        Subjects,
        Chapters,
        Difficulty,
        Reference,
        Question,
        questionImage,
      };
  
      chapter.paragMCQ.push(newParagMCQ);
  
      await existingSubject.save();
  
      return res.json({ msg: 'Paragraph MCQ added successfully', status: 'success' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });
  
// Update paragraph-based MCQ

//http://localhost:4010/v2/update/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c/657301e5695d635b383baad8
router.put('/update/:subjectId/:chapterId/:paragMCQId', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
      const paragMCQId = req.params.paragMCQId;
  
      const {
        Subjects,
        Chapters,
        Difficulty,
        Reference,
        Question,
        questionImage,
      } = req.body;
  
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      const chapter = existingSubject.chapter.id(chapterId);
  
      if (!chapter) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      const paragMCQ = chapter.paragMCQ.id(paragMCQId);
  
      if (!paragMCQ) {
        return res.status(404).json({ msg: 'Paragraph MCQ not found', status: 'failed' });
      }
  
      // Update paragraph-based MCQ properties
      paragMCQ.Subjects = Subjects;
      paragMCQ.Chapters = Chapters;
      paragMCQ.Difficulty = Difficulty;
      paragMCQ.Reference = Reference;
      paragMCQ.Question = Question;
      paragMCQ.questionImage = questionImage;
  
      await existingSubject.save();
  
      return res.json({ msg: 'Paragraph MCQ updated successfully', status: 'success' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });
  // Delete paragraph-based MCQ
  //http://localhost:4010/v2/delete/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c/657301e5695d635b383baad8
  router.delete('/delete/:subjectId/:chapterId/:paragMCQId', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
      const paragMCQId = req.params.paragMCQId;
  
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      const chapter = existingSubject.chapter.id(chapterId);
  
      if (!chapter) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      const paragMCQIndex = chapter.paragMCQ.findIndex((mcq) => mcq._id == paragMCQId);
  
      if (paragMCQIndex === -1) {
        return res.status(404).json({ msg: 'Paragraph MCQ not found', status: 'failed' });
      }
  
      // Remove the paragMCQ using splice
      chapter.paragMCQ.splice(paragMCQIndex, 1);
  
      await existingSubject.save();
  
      return res.json({ msg: 'Paragraph MCQ deleted successfully', status: 'success' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });

  
// GET method for retrieving paragMCQs
//http://localhost:4010/v2/getparamcq/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c/paragMCQ
router.get('/getparamcq/:subjectId/:chapterId/paragMCQ', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const chapterId = req.params.chapterId;
  
      const existingSubject = await Subject.findById(subjectId);
  
      if (!existingSubject) {
        return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
      }
  
      const chapter = existingSubject.chapter.id(chapterId);
  
      if (!chapter) {
        return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
      }
  
      const paragMCQs = chapter.paragMCQ;
  
      return res.json({ paragMCQs, status: 'success' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });

  // individualParagMCQID
 // http://localhost:4010/v2/getParagMCQById/657ae6c6482b3a688302a5fd/657ae786482b3a688302bb1a/657af517c5f4d27fdcc2f456
 router.get('/getParagMCQById/:subjectId/:chapterId/:paragMCQId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;
    const paragMCQId = req.params.paragMCQId;

    // Find the subject by ID
    const existingSubject = await Subject.findById(subjectId);

    if (!existingSubject) {
      return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
    }

    // Find the specific chapter within the subject
    const chapter = existingSubject.chapter.id(chapterId);

    if (!chapter) {
      return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
    }

    // Find the specific paragMCQ within the chapter
    const paragMCQ = chapter.paragMCQ.id(paragMCQId);

    if (!paragMCQ) {
      return res.status(404).json({ msg: 'ParagMCQ not found', status: 'failed' });
    }

    return res.json({ paragMCQ, status: 'success' });
  } catch (error) {
    console.error(error.message, 'individualParagMCQID');
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});


  module.exports = router;
