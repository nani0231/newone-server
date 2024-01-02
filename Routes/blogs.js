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