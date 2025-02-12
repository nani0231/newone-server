const express = require("express");
const Blogs= require("../Model/Blogs/blogs")
const router =  express.Router()
router.post("/Blogs", async (req, res) => {
    try {
      const {
        Title,
        Tags,
        Author,
        Description,
        Image
        } = req.body;
        let newUser = new Blogs({
            Title:Title,
            Tags:Tags,
            Author:Author,
            Description:Description,
            Image:Image
          
        });
      newUser.save();
  
       return res.status(200).json("User created successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal server error");
    }
  });

  router.get("/allBlogs", async (req, res) => {
  
    const allusers1 = await Blogs.find({})
    res.status(200).send(allusers1)
  });
  module.exports = router;

  router.delete("/deleteblog/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await Blogs.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
        res.send({ success: true, message: "Data deleted successfully", data: result });
      } else {
        res.status(404).send({ success: false, message: "blog not found" });
      }
    } catch (error) {
      console.error(error.message,'deleteblogid');
      res.status(500).send({ success: false, message: "Error deleting subject", error: error.message });
    }
  });

  router.put("/updateBlogs/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const {
        Title,
        Tags,
        Author,
        Description,
        Image
      } = req.body;
      const result = await Blogs.findByIdAndUpdate({ _id: id });
      if (!result) {
        return res.status(404).json({ success: false, message: "blogs not found" });
      }     
      result.Title = Title;
      result.Tags = Tags;
      result.Author = Author;
      result.Description = Description;
      result.Image = Image;
      // Save the updated subject document
      await result.save();
      return res.status(200).json("blogs update successfully");  
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal server error");
    }
  });
  
  router.get("/IndiVIDUALBlogs/:id", async (req, res) => {
    const id = req.params.id;
    const allusers1 = await Blogs.findById({_id :id})
    res.status(200).send(allusers1)
  });