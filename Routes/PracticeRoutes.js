// const express = require("express");
// const Practice = require("../Model/Practice");
// const router = express.Router();

// //categories

// // Get All Categories
// // http://localhost:4010/v5/categories

// router.get("/allpractices", async (req, res) => {
//   try {
//     const data = await Practice.find({});
//     res.json({ success: true, data: data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });
// // Get a specific category by ID
// // http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

// router.get("/categories/:categoryId", async (req, res) => {
//   try {
//     const category = await Practice.findById(req.params.categoryId);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // post Category
// // http://localhost:4010/v5/categories

// router.post("/practices", async (req, res) => {
//   const { name, description, tag, accesstype, accessplan } = req.body;
//   try {
//     const newCategory = new Practice({
//       name,
//       description,
//       tag,
//       accesstype,
//       accessplan,
//     });
//     const savedCategory = await newCategory.save();
//     res.json(savedCategory);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// //post Access
// router.post(
//   "/PracticecategorywiseAccess/:selectedCategoryId",
//   async (req, res) => {
//     try {
//       const { InstituteName, BatchYear, Batch, Access } = req.body;
//       const CategoryId = req.params.selectedCategoryId;

//       const CategoryPath = await Practice.findById(CategoryId);

//       if (!CategoryPath) {
//         return res
//           .status(404)
//           .json({ msg: "CategoryPath not found", status: "failed" });
//       }
//       const isCategoryExist = CategoryPath.AccessDetails.some(
//         (each) => each.InstituteName === InstituteName
//       );

//       if (isCategoryExist) {
//         return res.status(400).json({
//           msg: "Batchyear with the same Year already exists",
//           status: "failed",
//         });
//       }

//       const newAccessDetails = {
//         InstituteName,
//         BatchYear,
//         Batch,
//         Access,
//       };
//       CategoryPath.AccessDetails.push(newAccessDetails);
//       await CategoryPath.save();
//       return res
//         .status(200)
//         .json({ msg: "User added successfully", status: "success" });
//     } catch (e) {
//       console.error(e.message, "Adduser");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

// // Update Category
// // http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

// router.put("/practicesupdate/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { ...rest } = req.body;

//     const data = await Practice.findByIdAndUpdate(id, rest, { new: true });

//     if (!data) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     }

//     res.json({
//       success: true,
//       message: "Data updated successfully",
//       data: data,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Delete Category
// // http://localhost:4010/v5/categories/658156f2e7b43a5ed999fb7a

// router.delete("/practicelist/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await Practice.findByIdAndDelete(id);

//     if (!data) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" });
//     }

//     res.json({
//       success: true,
//       message: "Data deleted successfully",
//       data: data,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// module.exports = router;

// //addtopic
// router.post("/addPracticetopic/:categoryId", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const { categoryName, topicName, topicdescription } = req.body;

//     // Find the existing subject by ID
//     const existingcategorypath = await Practice.findById(categoryId);

//     if (!existingcategorypath) {
//       return res
//         .status(404)
//         .json({ msg: "Subject not found", status: "failed" });
//     }

//     // Check if the chapter with the same name already exists
//     const ispracticetopicExist = existingcategorypath.Practicetopic.some(
//       (topic) => topic.topicName === topicName
//     );

//     if (ispracticetopicExist) {
//       return res.status(400).json({
//         msg: "Chapter with the same name already exists",
//         status: "failed",
//       });
//     }
//     // Create a new chapter
//     const newtopic = {
//       topicName,
//       topicdescription,
//     };

//     // Add the new chapter to the "chapter" array in the subject
//     existingcategorypath.Practicetopic.push(newtopic);

//     // Save the updated subject document
//     await existingcategorypath.save();

//     return res.json({
//       msg: "PracticeTopic added successfully",
//       status: "success",
//     });
//   } catch (error) {
//     console.error(error.message, "postchapter");
//     return res
//       .status(500)
//       .json({ msg: "Internal Server Error", status: "failed" });
//   }
// });

// //deletetopic
// router.delete("/Deletepracticetopic/:categoryId/:topicId", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const topicId = req.params.topicId;

//     // Find the existing subject by ID
//     const existingcategorypath = await Practice.findById(categoryId);

//     if (!existingcategorypath) {
//       return res
//         .status(404)
//         .json({ msg: "Subject not found", status: "failed" });
//     }

//     // Find the index of the chapter to be deleted
//     const topicIndex = existingcategorypath.Practicetopic.findIndex(
//       (each) => each._id.toString() === topicId
//     );

//     if (topicIndex === -1) {
//       return res
//         .status(404)
//         .json({ msg: "Chapter not found", status: "failed" });
//     }

//     // Remove the chapter from the "chapter" array
//     existingcategorypath.Practicetopic.splice(topicIndex, 1);

//     // Save the updated subject document
//     await existingcategorypath.save();

//     return res.json({ msg: "topic deleted successfully", status: "success" });
//   } catch (error) {
//     console.error(error.message, "deletetopic");
//     return res
//       .status(500)
//       .json({ msg: "Internal Server Error", status: "failed" });
//   }
// });
// //updatetopic
// router.put("/editpracticetopic/:categoryId/:topicId", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const topicId = req.params.topicId;
//     const { name, description } = req.body;

//     // Find the existing subject by ID
//     const existingPracticecategory = await Practice.findById(categoryId);

//     if (!existingPracticecategory) {
//       return res
//         .status(404)
//         .json({ msg: "Subject not found", status: "failed" });
//     }

//     // Find the specific chapter within the subject
//     const topicToUpdate = existingPracticecategory.Practicetopic.id(topicId);

//     if (!topicToUpdate) {
//       return res
//         .status(404)
//         .json({ msg: "Chapter not found", status: "failed" });
//     }

//     // Update the chapter properties
//     topicToUpdate.topicName = name;
//     topicToUpdate.topicdescription = description;

//     // Save the updated subject document
//     await existingPracticecategory.save();

//     return res.json({
//       msg: "Topic updated successfully",
//       status: "success",
//       updatedtopic: topicToUpdate,
//     });
//   } catch (error) {
//     console.error(error.message, "updatetopic");
//     return res
//       .status(500)
//       .json({ msg: "Internal Server Error", status: "failed" });
//   }
// });

// //addtestinpractice
// router.post("/addtestinpractice/:categoryId/:topicId", async (req, res) => {
//   try {
//     const categoryId = req.params.categoryId;
//     const topicId = req.params.topicId;
//     const {
//       // category,
//       // topicList,
//       testName,
//       practiceType,
//       questions,
//       selectedSubject,
//       selectedChapters,
//       questionListMcq,
//       questionListParag,
//       questionListCoding
      
//     } = req.body;
//     // Find the subject by ID
//     const existingcategorypath = await Practice.findById(categoryId);
//     if (!existingcategorypath) {
//       return res
//         .status(404)
//         .json({ msg: "Subject not found", status: "failed" });
//     }

//     // Find the specific chapter within the subject
//     const topic = existingcategorypath.Practicetopic.id(topicId);

//     if (!topic) {
//       return res
//         .status(404)
//         .json({ msg: "Chapter not found", status: "failed" });
//     }

//     // Create a new MCQ
//     const newMCQ = {
//       testName,
//       practiceType,
//       questions,
//       selectedSubject,
//       selectedChapters,
//       questionListMcq,
//       questionListParag,
//       questionListCoding
//     };

//     // Add the new MCQ to the "MCQ" array in the chapter
//     topic.Testtopic.push(newMCQ);

//     // Save the updated subject document
//     await existingcategorypath.save();

//     return res
//       .status(200)
//       .json({ msg: "MCQ added successfully", status: "success" });
//   } catch (error) {
//     console.error(error.message);
//     return res
//       .status(500)
//       .json({ msg: "Internal Server Error", status: "failed" });
//   }
// });
// //deletetestinpractice
// router.delete(
//   "/deletetestinpractice/:categoryId/:topicId/:mcqId",
//   async (req, res) => {
//     try {
//       const categoryId = req.params.categoryId;
//       const topicId = req.params.topicId;
//       const mcqId = req.params.mcqId;

//       // Find the subject by ID
//       const existingCategorypath = await Practice.findById(categoryId);

//       if (!existingCategorypath) {
//         return res
//           .status(404)
//           .json({ msg: "Subject not found", status: "failed" });
//       }

//       // Find the specific chapter within the subject
//       const topic = existingCategorypath.Practicetopic.id(topicId);

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Chapter not found", status: "failed" });
//       }

//       // Use pull to remove the specific MCQ from the "MCQ" array
//       topic.Testtopic.pull({ _id: mcqId });

//       // Save the updated subject document
//       await existingCategorypath.save();

//       return res.json({ msg: "MCQ deleted successfully", status: "success" });
//     } catch (error) {
//       console.error(error.message, "deleteMCQ");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );
// //getmcqs
// router.get(
//   "/getPracticeMCQById/:categoryId/:topicId/:mcqId",
//   async (req, res) => {
//     try {
//       const categoryId = req.params.categoryId;
//       const topicId = req.params.topicId;
//       const mcqId = req.params.mcqId;

//       // Find the subject by ID
//       const existingcategorypath = await Practice.findById(categoryId);

//       if (!existingcategorypath) {
//         return res
//           .status(404)
//           .json({ msg: "Subject not found", status: "failed" });
//       }

//       // Find the specific chapter within the subject
//       const topic = existingcategorypath.Practicetopic.id(topicId);

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Chapter not found", status: "failed" });
//       }

//       // Find the specific MCQ within the chapter
//       const mcq = topic.Testtopic.id(mcqId);

//       if (!mcq) {
//         return res.status(404).json({ msg: "MCQ not found", status: "failed" });
//       }

//       return res.json({ mcq, status: "success" });
//     } catch (error) {
//       console.error(error.message);
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );
// //updatemcqs
// router.put(
//   "/practiceTestdata/:categoryId/:topicId/:mcqId",
//   async (req, res) => {
//     try {
//       const categoryId = req.params.categoryId;
//       const topicId = req.params.topicId;
//       const mcqId = req.params.mcqId;

//       const { testName } = req.body;
//       // Find the subject by ID
//       const existingcategorypath = await Practice.findById(categoryId);

//       if (!existingcategorypath) {
//         return res
//           .status(404)
//           .json({ msg: "Subject not found", status: "failed" });
//       }

//       // Find the specific chapter within the subject
//       const topic = existingcategorypath.Practicetopic.id(topicId);

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Chapter not found", status: "failed" });
//       }

//       // Find the specific MCQ within the chapter
//       const mcqToUpdate = topic.Testtopic.id(mcqId);

//       if (!mcqToUpdate) {
//         return res.status(404).json({ msg: "MCQ not found", status: "failed" });
//       }

//       // Update the MCQ properties
//       mcqToUpdate.testName = testName;
//       // Save the updated subject document
//       await existingcategorypath.save();

//       return res.json({
//         msg: "MCQ updated successfully",
//         status: "success",
//         updatedMCQ: mcqToUpdate,
//       });
//     } catch (error) {
//       console.error(error.message, "updateMCQ");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );


const express = require("express");
const Practice = require("../Model/Practice");
const router = express.Router();

//categories

// Get All Categories
// http://localhost:4010/v5/categories

router.get("/allpractices", async (req, res) => {
  try {
    const data = await Practice.find({});
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
// Get a specific category by ID
// http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Practice.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/practicetopics/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const practice = await Practice.findById(id);

    if (!practice) {
      return res.status(404).json({ error: "Practice not found" });
    }

    const topicNames = practice.Practicetopic.map((topic) => topic.topicName);

    res.json(topicNames);
  } catch (error) {
    console.error("Error fetching Practicetopic:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get('/allPracticetopics', async (req, res) => {
  try {
    const practices = await Practice.find({}, 'Practicetopic');
    const allPracticetopics = practices.flatMap(practice => practice.Practicetopic);
    res.json(allPracticetopics);
  } catch (error) {
    console.error('Error fetching Practicetopics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get("/allTesttopics", async (req, res) => {
  try {
    const allPractices = await Practice.find({});
    
    // Extract Testtopics from each practice
    const allTestTopics = allPractices.reduce((accumulator, practice) => {
      return accumulator.concat(practice.Practicetopic.reduce((topicAccumulator, topic) => {
        return topicAccumulator.concat(topic.Testtopic);
      }, []));
    }, []);

    res.json({ success: true, data: allTestTopics });
  } catch (error) {
    console.error("Error fetching Testtopics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// post Category
// http://localhost:4010/v5/categories

router.post("/practices", async (req, res) => {
  const { name, description, tag, accesstype, accessplan } = req.body;
  try {
    const newCategory = new Practice({
      name,
      description,
      tag,
      accesstype,
      accessplan,
    });
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//post Access
router.post(
  "/PracticecategorywiseAccess/:selectedCategoryId",
  async (req, res) => {
    try {
      const { InstituteName, BatchYear, Batch, Access } = req.body;
      const CategoryId = req.params.selectedCategoryId;

      const CategoryPath = await Practice.findById(CategoryId);

      if (!CategoryPath) {
        return res
          .status(404)
          .json({ msg: "CategoryPath not found", status: "failed" });
      }
      const isCategoryExist = CategoryPath.AccessDetails.some(
        (each) => each.InstituteName === InstituteName
      );

      if (isCategoryExist) {
        return res.status(400).json({
          msg: "Batchyear with the same Year already exists",
          status: "failed",
        });
      }

      const newAccessDetails = {
        InstituteName,
        BatchYear,
        Batch,
        Access,
      };
      CategoryPath.AccessDetails.push(newAccessDetails);
      await CategoryPath.save();
      return res
        .status(200)
        .json({ msg: "User added successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "Adduser");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

// Update Category
// http://localhost:4010/v5/categories/6581559cfe50e78e2a01cfee

router.put("/practicesupdate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ...rest } = req.body;

    const data = await Practice.findByIdAndUpdate(id, rest, { new: true });

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete Category
// http://localhost:4010/v5/categories/658156f2e7b43a5ed999fb7a

router.delete("/practicelist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Practice.findByIdAndDelete(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Data deleted successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;

//addtopic
router.post("/addPracticetopic/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { categoryName, topicName, topicdescription } = req.body;

    // Find the existing subject by ID
    const existingcategorypath = await Practice.findById(categoryId);

    if (!existingcategorypath) {
      return res
        .status(404)
        .json({ msg: "Subject not found", status: "failed" });
    }

    // Check if the chapter with the same name already exists
    const ispracticetopicExist = existingcategorypath.Practicetopic.some(
      (topic) => topic.topicName === topicName
    );

    if (ispracticetopicExist) {
      return res.status(400).json({
        msg: "Chapter with the same name already exists",
        status: "failed",
      });
    }
    // Create a new chapter
    const newtopic = {
      topicName,
      topicdescription,
    };

    // Add the new chapter to the "chapter" array in the subject
    existingcategorypath.Practicetopic.push(newtopic);

    // Save the updated subject document
    await existingcategorypath.save();

    return res.json({
      msg: "PracticeTopic added successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error.message, "postchapter");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

//deletetopic
router.delete("/Deletepracticetopic/:categoryId/:topicId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const topicId = req.params.topicId;

    // Find the existing subject by ID
    const existingcategorypath = await Practice.findById(categoryId);

    if (!existingcategorypath) {
      return res
        .status(404)
        .json({ msg: "Subject not found", status: "failed" });
    }

    // Find the index of the chapter to be deleted
    const topicIndex = existingcategorypath.Practicetopic.findIndex(
      (each) => each._id.toString() === topicId
    );

    if (topicIndex === -1) {
      return res
        .status(404)
        .json({ msg: "Chapter not found", status: "failed" });
    }

    // Remove the chapter from the "chapter" array
    existingcategorypath.Practicetopic.splice(topicIndex, 1);

    // Save the updated subject document
    await existingcategorypath.save();

    return res.json({ msg: "topic deleted successfully", status: "success" });
  } catch (error) {
    console.error(error.message, "deletetopic");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//updatetopic
router.put("/editpracticetopic/:categoryId/:topicId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const topicId = req.params.topicId;
    const { name, description } = req.body;

    // Find the existing subject by ID
    const existingPracticecategory = await Practice.findById(categoryId);

    if (!existingPracticecategory) {
      return res
        .status(404)
        .json({ msg: "Subject not found", status: "failed" });
    }

    // Find the specific chapter within the subject
    const topicToUpdate = existingPracticecategory.Practicetopic.id(topicId);

    if (!topicToUpdate) {
      return res
        .status(404)
        .json({ msg: "Chapter not found", status: "failed" });
    }

    // Update the chapter properties
    topicToUpdate.topicName = name;
    topicToUpdate.topicdescription = description;

    // Save the updated subject document
    await existingPracticecategory.save();

    return res.json({
      msg: "Topic updated successfully",
      status: "success",
      updatedtopic: topicToUpdate,
    });
  } catch (error) {
    console.error(error.message, "updatetopic");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//getallquestion
router.get('/questions/:practiceId/:topicId/:testId', async (req, res) => {
  try {
    const { practiceId, topicId, testId } = req.params;

    // Find the practice by ID
    const practice = await Practice.findById(practiceId);

    if (!practice) {
      return res.status(404).json({ msg: 'Practice not found', status: 'failed' });
    }

    // Find the topic by ID within the practice
    const topic = practice.Practicetopic.id(topicId);

    if (!topic) {
      return res.status(404).json({ msg: 'Topic not found', status: 'failed' });
    }

    // Find the test by ID within the topic
    const test = topic.Testtopic.id(testId);

    if (!test) {
      return res.status(404).json({ msg: 'Test not found', status: 'failed' });
    }

    // Extract the questions from the test
    const { questionListMcq } = test;

    res.status(200).json({ questions: { questionListMcq }, status: 'success' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});
//get test
router.get("/getTest/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Practice.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }

    // You can customize the response based on your needs
    res.status(200).json({ category, status: "success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
//gettest
router.get("/getTest/:categoryId/:topicId/:testId", async (req, res) => {
  try {
    const { categoryId, topicId, testId } = req.params;

    const category = await Practice.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }

    const topic = category.Practicetopic.id(topicId);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found", status: "failed" });
    }

    const test = topic.Testtopic.id(testId);

    if (!test) {
      return res.status(404).json({ msg: "Test not found", status: "failed" });
    }

    return res.status(200).json({ test, status: "success" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
// router.get("/getTest/:categoryId/:topicId/:testId", async (req, res) => {
//   try {
//     const { categoryId, topicId, testId } = req.params;

//     // Find the category by ID
//     const category = await Practice.findById(categoryId);

//     if (!category) {
//       return res.status(404).json({ msg: "Category not found", status: "failed" });
//     }

//     // Find the topic by ID within the category
//     const topic = category.Practicetopic.id(topicId);

//     if (!topic) {
//       return res.status(404).json({ msg: "Topic not found", status: "failed" });
//     }

//     // Find the test by ID within the topic
//     const test = topic.Testtopic.id(testId);

//     if (!test) {
//       return res.status(404).json({ msg: "Test not found", status: "failed" });
//     }

//     // Extract only the required properties (testName and questionListMcq)
//     const { testName, questionListMcq } = test;

//     // Return a response with the filtered properties
//     return res.status(200).json({ testName, questionListMcq, status: "success" });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
//   }
// });


//addtestinpractice
router.post("/addtestinpractice/:categoryId/:topicId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const topicId = req.params.topicId;
    const {
      // category,
      // topicList,
      testName,
      practiceType,
      questions,
      selectedSubject,
      selectedChapters,
      questionListMcq,
      questionListParag
      
    } = req.body;
    // Find the subject by ID
    const existingcategorypath = await Practice.findById(categoryId);
    if (!existingcategorypath) {
      return res
        .status(404)
        .json({ msg: "Subject not found", status: "failed" });
    }

    // Find the specific chapter within the subject
    const topic = existingcategorypath.Practicetopic.id(topicId);

    if (!topic) {
      return res
        .status(404)
        .json({ msg: "Chapter not found", status: "failed" });
    }

    // Create a new MCQ
    const newMCQ = {
      testName,
      practiceType,
      questions,
      selectedSubject,
      selectedChapters,
      questionListMcq,
      questionListParag
    };

    // Add the new MCQ to the "MCQ" array in the chapter
    topic.Testtopic.push(newMCQ);

    // Save the updated subject document
    await existingcategorypath.save();

    return res
      .status(200)
      .json({ msg: "MCQ added successfully", status: "success" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//deletetestinpractice
router.delete(
  "/deletetestinpractice/:categoryId/:topicId/:mcqId",
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const topicId = req.params.topicId;
      const mcqId = req.params.mcqId;

      // Find the subject by ID
      const existingCategorypath = await Practice.findById(categoryId);

      if (!existingCategorypath) {
        return res
          .status(404)
          .json({ msg: "Subject not found", status: "failed" });
      }

      // Find the specific chapter within the subject
      const topic = existingCategorypath.Practicetopic.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Chapter not found", status: "failed" });
      }

      // Use pull to remove the specific MCQ from the "MCQ" array
      topic.Testtopic.pull({ _id: mcqId });

      // Save the updated subject document
      await existingCategorypath.save();

      return res.json({ msg: "MCQ deleted successfully", status: "success" });
    } catch (error) {
      console.error(error.message, "deleteMCQ");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

//getmcqs
router.get(
  "/getPracticeMCQBymcqIdId/:categoryId/:topicId/:",
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const topicId = req.params.topicId;
      const mcqId = req.params.mcqId;

      // Find the subject by ID
      const existingcategorypath = await Practice.findById(categoryId);

      if (!existingcategorypath) {
        return res
          .status(404)
          .json({ msg: "Subject not found", status: "failed" });
      }

      // Find the specific chapter within the subject
      const topic = existingcategorypath.Practicetopic.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Chapter not found", status: "failed" });
      }

      // Find the specific MCQ within the chapter
      const mcq = topic.Testtopic.id(mcqId);

      if (!mcq) {
        return res.status(404).json({ msg: "MCQ not found", status: "failed" });
      }

      return res.json({ mcq, status: "success" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//updatemcqs
router.put(
  "/practiceTestdata/:categoryId/:topicId/:mcqId",
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const topicId = req.params.topicId;
      const mcqId = req.params.mcqId;

      const { testName } = req.body;
      // Find the subject by ID
      const existingcategorypath = await Practice.findById(categoryId);

      if (!existingcategorypath) {
        return res
          .status(404)
          .json({ msg: "Subject not found", status: "failed" });
      }

      // Find the specific chapter within the subject
      const topic = existingcategorypath.Practicetopic.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Chapter not found", status: "failed" });
      }

      // Find the specific MCQ within the chapter
      const mcqToUpdate = topic.Testtopic.id(mcqId);

      if (!mcqToUpdate) {
        return res.status(404).json({ msg: "MCQ not found", status: "failed" });
      }

      // Update the MCQ properties
      mcqToUpdate.testName = testName;
      // Save the updated subject document
      await existingcategorypath.save();

      return res.json({
        msg: "MCQ updated successfully",
        status: "success",
        updatedMCQ: mcqToUpdate,
      });
    } catch (error) {
      console.error(error.message, "updateMCQ");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
// Route to get all questions for a practice category based on ID
router.get("/getquestions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const practice = await Practice.findById(id);

    if (!practice) {
      return res.status(404).json({ error: "Practice not found" });
    }

    const allQuestions = [];

    // Iterate through Practicetopic and Testtopic to collect all questions
    practice.Practicetopic.forEach((topic) => {
      topic.Testtopic.forEach((test) => {
        allQuestions.push(...test.questionListMcq, ...test.questionListParag);
      });
    });

    res.json(allQuestions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//testtopics
router.get("/categories/:categoryId/testtopics", async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Practice.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const testTopics = category.Practicetopic.map(topic => ({
      topicName: topic.topicName,
      Testtopic: topic.Testtopic,
    }));

    res.json(testTopics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
///
// Route to get specific data based on ID

// Define a route to get a Testtopic by Practicetopicid and Testtopicid
router.get('/practicetopic/:Practicetopicid/testtopic/:Testtopicid', async (req, res) => {
  const { Practicetopicid, Testtopicid } = req.params;

  try {
    // Find the Testtopic using the provided Practicetopicid and Testtopicid
    const testtopic = await Practice.aggregate([
      {
        $match: { 'Practicetopic._id': mongoose.Types.ObjectId(Practicetopicid) }
      },
      {
        $project: {
          Practicetopic: {
            $filter: {
              input: '$Practicetopic',
              as: 'practicetopic',
              cond: {
                $eq: ['$$practicetopic._id', mongoose.Types.ObjectId(Practicetopicid)]
              }
            }
          }
        }
      },
      {
        $unwind: '$Practicetopic'
      },
      {
        $project: {
          Testtopic: {
            $filter: {
              input: '$Practicetopic.Testtopic',
              as: 'testtopic',
              cond: {
                $eq: ['$$testtopic._id', mongoose.Types.ObjectId(Testtopicid)]
              }
            }
          }
        }
      },
      {
        $unwind: '$Testtopic'
      }
    ]);

    if (testtopic.length === 0) {
      return res.status(404).json({ message: 'Testtopic not found' });
    }

    res.json(testtopic[0].Testtopic);
  } catch (error) {
    console.error('Error fetching Testtopic:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/testtopics/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Practice.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const allTesttopics = category.Practicetopic.reduce((acc, practiceTopic) => {
      if (practiceTopic.Testtopic && practiceTopic.Testtopic.length > 0) {
        acc.push(...practiceTopic.Testtopic);
      }
      return acc;
    }, []);

    res.json({ testtopics: allTesttopics });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});