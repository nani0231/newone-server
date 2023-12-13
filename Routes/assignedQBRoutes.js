const express = require("express");
const QbData= require("../Model/assignedQB")
const middleware = require("../Middlware");

const router =  express.Router()

// http://localhost:4010/assignedQB/qbdata

router.get('/qbdata', async (req, res) => {
    try {
      const qbData = await QbData.find();
      res.json(qbData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


//  http://localhost:4010/assignedQB/qbdata

  router.post('/qbdata',middleware, async (req, res) => {
    const qbData = new QbData({
      Name: req.body.Name,
      Description: req.body.Description,
      SubjectTag: req.body.SubjectTag
    });
  
    try {
      const newQbData = await qbData.save();
      res.status(201).json(newQbData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  //  http://localhost:4010/assignedQB/qbdata/Id

  router.put('/qbdata/:id',middleware, async (req, res) => {
    try {
      const updatedQbData = await QbData.findByIdAndUpdate(
        req.params.id,
        {
          Name: req.body.Name,
          Description: req.body.Description,
          SubjectTag: req.body.SubjectTag
        },
        { new: true }
      );
  
      res.json(updatedQbData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


//  http://localhost:4010/assignedQB/qbdata/Id

  router.delete('/qbdata/:id',middleware, async (req, res) => {
    try {
      await QbData.findByIdAndRemove(req.params.id);
      res.json({ message: 'Document deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  


  module.exports= router

  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjUyZDE1NGRlNWNkYmUzZTg5OTEyMGY0IiwiaWF0IjoxNzAyMjg4NDA4LCJleHAiOjE3MzgyODg0MDh9.LevfcVRdEAX_qKl9tsxW0ikbm2M6QpUCPhHSCZA3zM0