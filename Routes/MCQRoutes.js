const express = require('express');
const router = express.Router();
const Subject = require('../Model/Subjects');


//http://localhost:4010/v1/addMCQ/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c
// Example URL: http://localhost:4010/v1/addMCQ/subjectId/chapterId
router.post('/addMCQ/:subjectId/:chapterId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;
    const {
      selectquestiontype,
      Subjects,
      Chapters,
      Difficulty,
      Reference,
      Question,
      questionImage,
      Option1,
      Option2,
      Option3,
      correctAnswer,
      Explanation,
    } = req.body;
    console.log(subjectId,chapterId,req.body,"sai")
    // Find the subject by ID
    const existingSubject = await Subject.findById(subjectId);
    console.log(existingSubject)
    if (!existingSubject) {
      return res.status(404).json({ msg: 'Subject not found', status: 'failed' });
    }

    // Find the specific chapter within the subject
    const chapter = existingSubject.chapter.id(chapterId);
    console.log(chapter)

    if (!chapter) {
      return res.status(404).json({ msg: 'Chapter not found', status: 'failed' });
    }

    // Create a new MCQ
    const newMCQ = {
      selectquestiontype,
      Subjects,
      Chapters,
      Difficulty,
      Reference,
      Question,
      questionImage,
      Option1,
      Option2,
      Option3,
      correctAnswer,
      Explanation,
    };

    // Add the new MCQ to the "MCQ" array in the chapter
    chapter.MCQ.push(newMCQ);

    // Save the updated subject document
    await existingSubject.save();

    return res.status(200).json({ msg: 'MCQ added successfully', status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});

// Example URL: http://localhost:4010/v1/getMCQs/subjectId/chapterId
//http://localhost:4010/v1/getMCQs/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c
router.get('/getMCQs/:subjectId/:chapterId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;

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

    // Retrieve all MCQs for the chapter
    const mcqs = chapter.MCQ;

    return res.json({ mcqs, status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});
//http://localhost:4010/v1/getMCQById/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c/6571c91690a0c6ad3c0dbbaf
router.get('/getMCQById/:subjectId/:chapterId/:mcqId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;
    const mcqId = req.params.mcqId;

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

    // Find the specific MCQ within the chapter
    const mcq = chapter.MCQ.id(mcqId);

    if (!mcq) {
      return res.status(404).json({ msg: 'MCQ not found', status: 'failed' });
    }

    return res.json({ mcq, status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});

// Example URL: http://localhost:4010/v1/updateMCQ/subjectId/chapterId/mcqId
//http://localhost:4010/v1/updateMCQ/6571ad89cf0acc567c548296/6571ae96cf0acc567c54829c/6571c97f41322bf83b4f9d5f
router.put('/updateMCQ/:subjectId/:chapterId/:mcqId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;
    const mcqId = req.params.mcqId;

    const {
      selectquestiontype,
      Subjects,
      Chapters,
      Difficulty,
      Reference,
      Question,
      questionImage,
      Option1,
      Option2,
      Option3,
      correctAnswer,
      Explanation,
    } = req.body;
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

    // Find the specific MCQ within the chapter
    const mcqToUpdate = chapter.MCQ.id(mcqId);

    if (!mcqToUpdate) {
      return res.status(404).json({ msg: 'MCQ not found', status: 'failed' });
    }

    // Update the MCQ properties
    mcqToUpdate.selectquestiontype = selectquestiontype;
    mcqToUpdate.Subjects = Subjects;
    mcqToUpdate.Chapters = Chapters;
    mcqToUpdate.Difficulty = Difficulty;
    mcqToUpdate.Reference = Reference;
    mcqToUpdate.Question = Question;
    mcqToUpdate.questionImage = questionImage;
    mcqToUpdate.Option1 = Option1;
    mcqToUpdate.Option2 = Option2;
    mcqToUpdate.Option3 = Option3;
    mcqToUpdate.correctAnswer = correctAnswer;
    mcqToUpdate.Explanation = Explanation;

    // Save the updated subject document
    await existingSubject.save();

    return res.json({ msg: 'MCQ updated successfully', status: 'success', updatedMCQ: mcqToUpdate });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});



// Example URL: http://localhost:4010/v1/deleteMCQ/subjectId/chapterId/mcqId
router.delete('/deleteMCQ/:subjectId/:chapterId/:mcqId', async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapterId = req.params.chapterId;
    const mcqId = req.params.mcqId;

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

    // Use pull to remove the specific MCQ from the "MCQ" array
    chapter.MCQ.pull({ _id: mcqId });

    // Save the updated subject document
    await existingSubject.save();

    return res.json({ msg: 'MCQ deleted successfully', status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});


module.exports = router;
