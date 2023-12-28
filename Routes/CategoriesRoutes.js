const express = require("express");
const Category = require("../Model/categories")
const router =  express.Router()

//categories

// Get All Categories
// http://localhost:4010/v5/categories

router.get("/allcategories", async (req, res) => {
    try {
        const data = await Category.find({});
        res.json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  // Get a specific category by ID
// http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

router.get("/categories/:categoryId", async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  

 

 // post Category
// http://localhost:4010/v5/categories


router.post("/categories", async (req, res) => {
    const { name, description, tag, accesstype, accessplan } = req.body;
    try {
        const newCategory = new Category({ name, description, tag, accesstype, accessplan });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
  // Update Category
// http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

  router.put("/categoriesupdate/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { ...rest } = req.body;
        
        const data = await Category.findByIdAndUpdate(id, rest, { new: true });
        
        if (!data) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
  
        res.json({ success: true, message: "Data updated successfully", data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  // Delete Category
// http://localhost:4010/v5/categories/658156f2e7b43a5ed999fb7a

  router.delete("/categorieslist/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const data = await Category.findByIdAndDelete(id);
        
        if (!data) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
  
        res.json({ success: true, message: "Data deleted successfully", data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

module.exports= router

  
  