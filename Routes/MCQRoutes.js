// const express = require("express");
// const MCQ = require('../Model/Mcq');
// const router =  express.Router()

// //creating MCQ

// router.post('/mcq', async (req, res) => {
//     try {
//       const newMCQ = new MCQ(req.body);
//       const savedmcq = await newMCQ.save();
//       res.json(savedmcq);
//       // return res.json(await Chapter.find())
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// //Get all
// //http://localhost:4010/v3/mcq
//   router.get('/mcq', async (req, res) => { 
//     try {
//       const mcq = await MCQ.find();
//       res.status(200).json(mcq);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   });
// // Get a specific chapter by ID (GET)
// //http://localhost:4010/v3/mcq/65703fc8b96d16cb814cd1e1
//   router.get('/mcq/:id', async (req, res) => {
//     try {
//       const mcq = await MCQ.findById(req.params.id);
//       if (!mcq) {
//         return res.status(404).json({ message: 'Chapter not found' });
//       }
//       res.json(mcq);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// // Update a chapter by ID (PUT)
// //http://localhost:4010/v3/mcq/657040c6b96d16cb814cd1e5
//   router.put('/mcq/:id', async (req, res) => {
//     try {
//       const updatedMcq = await MCQ.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       if (!updatedMcq) {
//         return res.status(404).json({ message: 'Chapter not found' });
//       }
//       res.json(updatedMcq);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

//    //delete mcq
//   // http://localhost:4010/v3/mcq/657040c6b96d16cb814cd1e5
//   router.delete("/mcq/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       console.log(id);
  
//       const data = await MCQ.deleteOne({ _id: id });
  
//       if (data.deletedCount === 1) {
//         res.send({ success: true, message: "Data deleted successfully", data });
//       } else {
//         res.status(404).send({ success: false, message: "Chapter not found" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ success: false, message: "Error deleting chapter", error: error.message });
//     }
//   });
//   //kumar
//   module.exports= router