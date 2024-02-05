const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { exec } = require("child_process");
const { generateFile } = require("./Model/CodeCompailer/generateFile");
const { executeCpp } = require("./Model/CodeCompailer/executeCpp");
const { executeC } = require("./Model/CodeCompailer/excecuteC");
const {
  executeJavaScript,
} = require("./Model/CodeCompailer/ececutejavascript");
const Job = require("../skillhub_server/Model/CodeCompailer/Job");
const { executePy } = require("./Model/CodeCompailer/executePy");
const { executeRuby } = require("./Model/CodeCompailer/executeRuby");
const { executeJava } = require("./Model/CodeCompailer/ececuteJava");
require("dotenv").config();
const mongoose = require("mongoose");
 
const Subject =require('./Model/Subject')
 
const userData = require("./Model/userData");

const jwt = require("jsonwebtoken");
const middleware = require("./middleware/jwtAuth");
const AddInstituteData = require("./Model/AddInstituteData");
const AddUsersData = require("./Model/StudentsData");
const AddUserByBatch = require("./Model/ByBatch");
const ByList = require("./Model/ByList");
const AddvideoData = require("./Model/LearnPath/Addvideo");
const videoFile = require("./Model/LearnPath/AddVideoFile");
const signupData = require("./Model/signup/signform");
 
const allLearningPaths = require("./Model/LearnPath/AlllearningPaths");
const paragMCQRouter = require('./Routes/ParagRoutes');
const Categories = require("./Model/categories")
const Topic = require("./Model/topic")
const AddVideoFile = require("./Model/LearnPath/AddVideoFile");
const app = express();
app.use(express.json());
app.use(cors());
const port = 4010;
 
const mogoURL =
  "mongodb+srv://badasiva22:Siva991276@cluster0.iis7lrd.mongodb.net/perfex-stack-project?retryWrites=true&w=majority";
 
app.use(express.json());
app.use(cors({ origin: "*" }));
//initalizing mongodb to node
mongoose
  .connect(mogoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e.message));

app.get("/", (req, res) => {
  try {
    res.send("Welcome to developer hubs server");
  } catch (error) {
    console.error(error.message, "default");
    res.status(500).json("Internal Server Error");
  }
});

app.post("/UserRegister", async (req, res) => {
  console.log(req.body);

  try {
    const user = await userData.findOne({ UserEmail: req.body.UserEmail }); // mongo db
    if (!user) {
      const newUser = {
        UserEmail: req.body.UserEmail,
        UserPassword: req.body.UserPassword,
      };
      const userDetails = await userData.create(newUser); //  POSTING TO COLLECTION OR MODEL
      console.log(userDetails);

      res.status(200).send("user created successfully");
    } else {
      // if user mail id is founded send below response
      res.status(400).json("user already registered");
    }
  } catch (e) {
    console.log(e.message, "UserRegister");
    return res.status(500).json("message: e.message");
  }
});

//login

app.post("/Userlogin", async (req, res) => {
  const { UserEmail, UserPassword } = req.body;
  try {
    const user = await userData.findOne({ UserEmail });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }
    if (UserPassword !== user.UserPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = {
      id: user._id,
    };
    let token = jwt.sign(payload, "siva", { expiresIn: "24hr" });
    console.log(token);
    return res
      .status(200)
      .json({ message: "User Login Success", token: token });
  } catch (error) {
    console.error(error.message, "Userlogin");
    res.status(500).json({
      message: "An error occurred on the server. Please try again later.",
    });
  }
});
//Add Institute

app.post("/AddInstitute", async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await AddInstituteData.findOne({}, null, {
      sort: { Sno: -1 },
    });
    //siva

    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }

    const user = await AddInstituteData.findOne({
      PrimaryEmail: req.body.PrimaryEmail,
    });

    if (!user) {
      const AddUser = {
        Sno: newSno, // Use the newly calculated ID
        InstituteName: req.body.InstituteName,
        HeadName: req.body.HeadName,
        PrimaryEmail: req.body.PrimaryEmail,
        PrimaryContactNumber: req.body.PrimaryContactNumber,
        SecondaryEmail: req.body.SecondaryEmail,
        SecondaryContactNumber: req.body.SecondaryContactNumber,
        Address: req.body.Address,
        City: req.body.City,
        InstituteCode: req.body.InstituteCode,
        InstituteType: req.body.InstituteType,
        AxiosPlans: req.body.AxiosPlans,
        Password: req.body.Password,
        BatchYear: req.body.BatchYear,
        SelectBatch: req.body.SelectBatch,
      };
      const AdduserDetails = await AddInstituteData.create(AddUser);

      console.log(AdduserDetails);
      res.status(200).send("User created successfully");
    } else {
      res.status(400).json("User with the same email already registered");
    }
  } catch (e) {
    console.error(e.message, "AddInstitute");
    return res.status(500).json(e.message);
  }
});
// app.post('/institutes', async (req, res) => {
//   try {
//     const newInstitute = new AddInstituteData(req.body);
//     await newInstitute.save();
//     res.status(201).json(newInstitute);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.post("/institutes", async (req, res) => {
//   try {
//     const newInstitute = await AddInstituteData.create(req.body);
//     res.status(201).json(newInstitute);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// POST a new institute
// app.post("/institutes", async (req, res) => {
//   try {
//     const newInstitute = new AddInstituteData(req.body);
//     await newInstitute.save();
//     res.json({ msg: "Institute created successfully", institute: newInstitute });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/addinstitute", async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//     } = req.body;
//     const isLearningPathExist = await allLearningPaths.findOne({
//       learningPathTitle: learningPathTitle,
//     });
//     if (isLearningPathExist) {
//       return res.send({ msg: "Path Already Registered", status: "failed" });
//     }
//     const CurrentTime = new Date();

//     let newLearningPath = new allLearningPaths({
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//     });
//     newLearningPath.save(); //saving mongodb collection
//     return res.send({ msg: "Path Created Successfully", status: "success" });
//   } catch (e) {
//     console.error(e.message, "addlearningpath");
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/addinstitute", async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//       // InstituteBatchYear,
//     } = req.body;

//     // Check if the institute already exists
//     const isExistingInstitute = await AddInstituteData.findOne({
//       InstituteName: InstituteName,
//     });

//     if (isExistingInstitute) {
//       return res.send({ msg: "Institute Already Registered", status: "failed" });
//     }

//     // Create a new institute instance
//     const newInstitute = new AddInstituteData({
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//       // InstituteBatchYear,
//     });

//     // Save the new institute to the database
//     await newInstitute.save();

//     // Send a success response
//     return res.send({ msg: "Institute Created Successfully", status: "success" });
//   } catch (e) {
//     console.error(e.message, "addinstitute");
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/institutes", async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//     } = req.body;

//     // Check if the institute already exists
//     const isExistingInstitute = await AddInstituteData.findOne({
//       InstituteName: InstituteName,
//     });

//     if (isExistingInstitute) {
//       return res.send({
//         msg: "Institute Already Registered",
//         status: "failed",
//       });
//     }
//     const snoValue = new mongoose.Types.ObjectId().toString();
//     // Create a new institute instance
//     const newInstitute = new AddInstituteData({
//       Sno: snoValue,
//       InstituteName,
//       HeadName,
//       PrimaryEmail,
//       PrimaryContactNumber,
//       SecondaryEmail,
//       SecondaryContactNumber,
//       Address,
//       City,
//       InstituteCode,
//       InstituteType,
//       AxiosPlans,
//       Password,
//     });

//     // Save the new institute to the database
//     await newInstitute.save();

//     // Send a success response
//     return res.send({
//       msg: "Institute Created Successfully",
//       status: "success",
//     });
//   } catch (e) {
//     if (e.code === 11000 && e.keyPattern && e.keyPattern.Sno) {
//       // Duplicate key error for Sno field
//       return res.send({
//         msg: "Duplicate Sno value",
//         status: "failed",
//       });
//     }
//     console.error(e.message, "addinstitute");
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/addinstitute/batchyear", async (req, res) => {
//   try {
//     const { instituteId, batchYear } = req.body;

//     // Find the institute by ID
//     const institute = await AddInstituteData.findOne({ _id: instituteId });

//     if (!institute) {
//       return res.status(404).json({ msg: "Institute not found", status: "failed" });
//     }

//     // Add new batch year
//     institute.InstituteBatchYear.push({ BatchYear: batchYear });

//     // Save the changes
//     await institute.save();

//     res.status(201).json({ msg: "Batch Year added successfully", status: "success" });
//   } catch (error) {
//     console.error(error.message, "addBatchYear");
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.get("/institutes", async (req, res) => {
//   try {
//     const institutes = await AddInstituteData.find();
//     res.json(institutes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get a specific institute by ID
// app.get("/institutes/:id", async (req, res) => {
//   try {
//     const institute = await AddInstituteData.findById(req.params.id);
//     if (!institute) {
//       return res.status(404).json({ error: "Institute not found" });
//     }
//     res.json(institute);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update a specific institute by ID
// app.put("/institutes/:id", async (req, res) => {
//   try {
//     const updatedInstitute = await AddInstituteData.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedInstitute) {
//       return res.status(404).json({ error: "Institute not found" });
//     }
//     res.json(updatedInstitute);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete a specific institute by ID
// app.delete("/institutes/:id", async (req, res) => {
//   try {
//     const deletedInstitute = await AddInstituteData.findByIdAndRemove(
//       req.params.id
//     );
//     if (!deletedInstitute) {
//       return res.status(404).json({ error: "Institute not found" });
//     }
//     res.json(deletedInstitute);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
//update

app.put("/UpdateInstitute/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AddInstituteData.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json("User Not Found");
    }

    return res.status(200).json("Users data updated successfully");
  } catch (error) {
    console.error(error.message, "UpdateInstitute");
    return res.status(500).json("Internal Server Error");
  }
});

//delete
app.delete("/deleteInstitute/:id", async (req, res) => {
  try {
    const id = req.params.id; // Use req.params.id to get the instituteId
    const deletedInstitute = await AddInstituteData.findByIdAndRemove(id);

    if (deletedInstitute) {
      return res.status(200).json("Institute deleted successfully");
    } else {
      return res.status(404).json("Institute not found");
    }
  } catch (e) {
    console.error(e.message, "deleteInstitute");
    return res.status(500).json(e.message);
  }
});

app.get("/allAddInstitutes", async (req, res) => {
  try {
    const allInstitutes = await AddInstituteData.find({});
    return res.json(allInstitutes);
  } catch (error) {
    console.error(error.message, "allAddInstitutes");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//get single id data
app.get("/individualInstitute/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const individualInstitute1 = await AddInstituteData.findById({ _id: id });
    if (!individualInstitute1) {
      return res.send("Institute not found!!!");
    }
    return res.send(individualInstitute1);
  } catch (error) {
    console.error(error.message, "individualInstitute");
    return res.status(500).send("Internal Server Error");
  }
});

app.get(
  "/individualInstituteNames/:InstituteName",

  async (req, res) => {
    try {
      const { InstituteName } = req.params;
      const individualInstitute = await AddInstituteData.findOne({
        InstituteName: InstituteName,
      });

      if (!individualInstitute) {
        return res.status(404).send("User not Found!!!");
      }

      return res.send(individualInstitute);
    } catch (error) {
      console.error(error.message, "individualInstituteNames");
      return res.status(500).json("Internal Server Error");
    }
  }
);
//add batchyear
app.post("/addBatchYear/:instituteId", async (req, res) => {
  try {
    const instituteId = req.params.instituteId;
    const { BatchYear} = req.body;

    // Find the existing learning path by ID
    const existingInstituteBatchYear = await AddInstituteData.findById(
      instituteId
    );

    if (!existingInstituteBatchYear) {
      return res
        .status(404)
        .json({ msg: "Learning path not found", status: "failed" });
    }

    // Check if the topic with the same name already exists
    const isBatchyearExist = existingInstituteBatchYear.InstituteBatchYear.some(
      (each) => each.BatchYear === BatchYear
    );

    if (isBatchyearExist) {
      return res.status(400).json({
        msg: "Batchyear with the same Year already exists",
        status: "failed",
      });
    }

    // Create a new topic
    const newBatchyear = {
      BatchYear, // Assign the current date to TopicTime
    };


    // Add the new topic to the "topics" array in the learning path
    existingInstituteBatchYear.InstituteBatchYear.push(newBatchyear);

    // Save the updated learning path document
    await existingInstituteBatchYear.save();

    return res.json({ msg: "BatchYear added successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "addBatchYear");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//updateBatchyear
app.put("/updateBatchYear/:instituteId/:BatchYearId", async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchYearId = req.params.BatchYearId;
      const BatchYear = req.body.BatchYear;
      console.log(BatchYear)

      // Find the existing learning path by ID
      const existingInstitutePath = await AddInstituteData.findById(
        instituteId
      );

      if (!existingInstitutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the index of the topic within the "topics" array
      const BatchYearIndex = existingInstitutePath.InstituteBatchYear.findIndex(
        (t) => t._id.toString() === BatchYearId
      );

      if (BatchYearIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Update the properties of the existing topic
      existingInstitutePath.InstituteBatchYear[BatchYearIndex].BatchYear = BatchYear;

      // Save the updated learning path document
      await existingInstitutePath.save();

      return res.json({ msg: "BatchYear updated successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "updateBatchYear");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//deleteBatchYear
app.delete(
  "/onselectedBatchyeardeleteinInstitutePath/:instituteId/:BatchYearId",  async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchYearId = req.params.BatchYearId;

      // Find the learning path by ID
      const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the index of the topic within the "topics" array
      const BatchYearIndex = institutePath.InstituteBatchYear.findIndex(
        (t) => t._id.toString() === BatchYearId
      );

      if (BatchYearIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Remove the topic and all its content from the "topics" array
      institutePath.InstituteBatchYear.splice(BatchYearIndex, 1);

      // Save the updated learning path document
      await institutePath.save();

      return res.status(200).json({
        msg: "BatchYear Deleted Successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "/onselectedBatchYearDeleteininstitutePath");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//add batches
app.post(
  "/addBatch/:instituteId/:BatchyearId", async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchyearId = req.params.BatchyearId;
      const {Batch} = req.body;
     
      const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const BatchYear = institutePath.InstituteBatchYear.id(BatchyearId);

      if (!BatchYear) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Add the new content to the "content" array in the topic
      BatchYear.InsituteBatch.push({
        Batch
      });

      // Save the updated learning path document
      await institutePath.save();

      return res
        .status(200)
        .json({ msg: "Batch added successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "addBatch");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//update batch
app.put(
  "/updateBatch/:instituteId/:batchYearId/:batchId",

  async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const batchYearId = req.params.batchYearId;
      const batchId = req.params.batchId;
      const { Batch } = req.body;

      // Find the existing learning path by ID
      const existingInstitutePath = await AddInstituteData.findById(
        instituteId
      );

      if (!existingInstitutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the batch year within the learning path by ID
      const batchYear = existingInstitutePath.InstituteBatchYear.find(
        (t) => t._id.toString() === batchYearId
      );

      if (!batchYear) {
        return res
          .status(404)
          .json({ msg: "Batch year not found", status: "failed" });
      }

      // Find the batch item within the "InsituteBatch" array by batchId
      const batchItem = batchYear.InsituteBatch.find(
        (c) => c._id.toString() === batchId
      );

      if (!batchItem) {
        return res
          .status(404)
          .json({ msg: "Batch not found", status: "failed" });
      }

      // Check if the new batch already exists in the batch year
      const batchExists = batchYear.InsituteBatch.some(
        (c) =>
          c.Batch === Batch &&
          c._id.toString() !== batchId
      );

      if (batchExists) {
        return res
          .status(400)
          .json({ msg: "Batch already exists", status: "failed" });
      }

      // Update the properties of the existing batch
      batchItem.Batch = Batch;

      // Save the updated learning path document
      await existingInstitutePath.save();

      return res.json({
        msg: "Batch updated successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "updateBatch");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//delete batch
app.delete(
  "/onselectedBatchinBatchYearininstitutePath/:instituteId/:BatchYearId/:batchId",
  async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchYearId = req.params.BatchYearId;
      const batchId = req.params.batchId;

      // Find the learning path by ID
      const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the batch year within the learning path by ID
      const BatchYearpath = institutePath.InstituteBatchYear.find(
        (t) => t._id.toString() === BatchYearId
      );

      if (!BatchYearpath) {
        return res
          .status(404)
          .json({ msg: "Batch year not found", status: "failed" });
      }

      // Find the index of the batch within the "InsituteBatch" array
      const BatchIndex = BatchYearpath.InsituteBatch.findIndex(
        (batch) => batch._id.toString() === batchId
      );

      if (BatchIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Batch not found", status: "failed" });
      }

      // Remove the batch from the "InsituteBatch" array
      BatchYearpath.InsituteBatch.splice(BatchIndex, 1);

      // Save the updated learning path document
      await institutePath.save();

      return res
        .status(200)
        .json({ msg: "Batch deleted successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "/onselectedBatchinBatchYearininstitutePath");

      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//Add Users
app.post(
  "/AddUsers/:instituteId/:BatchyearId/:BatchId",
  async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchyearId = req.params.BatchyearId;
      const BatchId = req.params.BatchId;
      const {
        Regdid,
        FirstName,
        LastName,
        userEmail,
        userNumber,
        AccessPlans,
        Password,
        Status,
        ExpiryDate
      } = req.body;

      // Check if email or mobile number already exists
      const userExists = await AddInstituteData.findOne({
        'InstituteBatchYear.InsituteBatch.InstituteUsersList': {
          $elemMatch: {
            $or: [{ userEmail: userEmail }, { userNumber: userNumber }]
          }
        }
      });

      if (userExists) {
        return res.status(400).json({
          msg: "Email or mobile number already exists",
          status: "failed"
        });
      }

      const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res.status(404).json({
          msg: "Learning path not found",
          status: "failed"
        });
      }

      const BatchYear = institutePath.InstituteBatchYear.id(BatchyearId);

      if (!BatchYear) {
        return res.status(404).json({
          msg: "Batch year not found",
          status: "failed"
        });
      }

      const Batch = BatchYear.InsituteBatch.id(BatchId);

      if (!Batch) {
        return res.status(404).json({
          msg: "Batch not found",
          status: "failed"
        });
      }

      Batch.InstituteUsersList.push({
        Regdid,
        FirstName,
        LastName,
        userEmail,
        userNumber,
        AccessPlans,
        Password,
        Status,
        ExpiryDate,
        currentTime: new Date()
      });

      await institutePath.save();

      return res.status(200).json({
        msg: "User added successfully",
        status: "success"
      });
    } catch (e) {
      console.error(e.message, "Adduser");
      return res.status(500).json({
        msg: "Internal Server Error",
        status: "failed"
      });
    }
  }
);

//get user
app.get("/GetUserdetailseperatly/:instituteId/:batchyearId/:batchId/:userId", async (req, res) => {
  try {
    const instituteId = req.params.instituteId;
    const batchyearId = req.params.batchyearId;
    const batchId = req.params.batchId;
    const userId = req.params.userId;

    const institutePath = await AddInstituteData.findById(instituteId);

    if (!institutePath) {
      return res.status(404).json({ msg: "Institute not found", status: "failed" });
    }

    const batchYear = institutePath.InstituteBatchYear.id(batchyearId);

    if (!batchYear) {
      return res.status(404).json({ msg: "Batch year not found", status: "failed" });
    }

    const batch = batchYear.InsituteBatch.id(batchId);

    if (!batch) {
      return res.status(404).json({ msg: "Batch not found", status: "failed" });
    }

    const user = batch.InstituteUsersList.id(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    return res.status(200).json({ msg: "User found successfully", status: "success", user });
  } catch (e) {
    console.error(e.message, "GetUser");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
//update password in userdetails
app.put("/UpdateUserPassword/:instituteId/:batchyearId/:batchId/:userId", async (req, res) => {
  try {
    const instituteId = req.params.instituteId;
    const batchyearId = req.params.batchyearId;
    const batchId = req.params.batchId;
    const userId = req.params.userId;

    const institutePath = await AddInstituteData.findById(instituteId);

    if (!institutePath) {
      return res.status(404).json({ msg: "Institute not found", status: "failed" });
    }

    const batchYear = institutePath.InstituteBatchYear.id(batchyearId);

    if (!batchYear) {
      return res.status(404).json({ msg: "Batch year not found", status: "failed" });
    }

    const batch = batchYear.InsituteBatch.id(batchId);

    if (!batch) {
      return res.status(404).json({ msg: "Batch not found", status: "failed" });
    }

    const user = batch.InstituteUsersList.id(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }
    const newPassword = req.body.Password;
    console.log(newPassword)
    user.Password = newPassword;
    await institutePath.save();
    return res.status(200).json({ msg: "Password updated successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "UpdateUserPassword");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
//update userdetails
app.put("/updateUserdetails/:instituteId/:batchyearId/:batchId/:userId", async (req, res) => {
  try {
    const instituteId = req.params.instituteId;
    const batchyearId = req.params.batchyearId;
    const batchId = req.params.batchId;
    const userId = req.params.userId;

    const institutePath = await AddInstituteData.findById(instituteId);

    if (!institutePath) {
      return res.status(404).json({ msg: "Institute not found", status: "failed" });
    }

    const batchYear = institutePath.InstituteBatchYear.id(batchyearId);

    if (!batchYear) {
      return res.status(404).json({ msg: "Batch year not found", status: "failed" });
    }

    const batch = batchYear.InsituteBatch.id(batchId);

    if (!batch) {
      return res.status(404).json({ msg: "Batch not found", status: "failed" });
    }

    const user = batch.InstituteUsersList.id(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }
    const newDetails = req.body.newDetails;
    // user.InstituteUsersList =newDetails
    user.Regdid = newDetails.Regdid,
    user.FirstName = newDetails.FirstName,
    user.LastName = newDetails.LastName,
    user.userEmail = newDetails.userEmail,
    user.userNumber = newDetails.userNumber,
    user.AccessPlans = newDetails.AccessPlans,
    user.Password = newDetails.Password,
    user.ExpiryDate = newDetails.ExpiryDate,
    await institutePath.save();

    return res.status(200).json({ msg: "User details updated successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "UpdateUserDetails");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.post("/UserDetailslogin", middleware, async (req, res) => {
  const { userEmail, Password } = req.body;

  try {
    const user = await AddUsersData.findOne({ userEmail });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    if (Password !== user.Password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = {
      user: user.id,
    };

    jwt.sign(payload, "jwtpassword", { expiresIn: "1h" }, (err, token) => {
      if (err) {
        throw err;
      }

      res.json({ token, id: user.id });
    });
  } catch (error) {
    console.error(error.message, "UserDetailslogin");
    res.status(500).json({
      message: "An error occurred on the server. Please try again later.",
    });
  }
});

app.get("/allUsersData", async (req, res) => {
  try {
    const allInstitutes = await AddUsersData.find({});
    return res.json(allInstitutes);
  } catch (error) {
    console.error(error.message, "allUsersData");
    return res.status(500).json("Internal Server Error");
  }
});

app.get("/individualUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const individualInstitute = await AddUsersData.findById(id);

    if (!individualInstitute) {
      return res.status(404).send("User not Found!!!");
    }

    return res.send(individualInstitute);
  } catch (error) {
    console.error(error.message, "individualUser");
    return res.status(500).json("Internal Server Error");
  }
});
app.post(
  "/ByBatchData/:instituteId/:BatchyearId/:BatchId", async (req, res) => {
    try {
      const instituteId = req.params.instituteId;
      const BatchyearId = req.params.BatchyearId;
      const BatchId = req.params.BatchId;
      const {AccessPlans,Access} = req.body;
     
      const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const BatchYear = institutePath.InstituteBatchYear.id(BatchyearId);

      if (!BatchYear) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      const Batch = BatchYear.InsituteBatch.id(BatchId);

      if (!Batch) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Add the new content to the "content" array in the topic
      Batch.ExtendUsersAccess.push({
        AccessPlans,   
        Access     
      });

      // Save the updated learning path document
      await institutePath.save();

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


app.post("/ByListData/:instituteId", async (req, res) => {
  try {
    const instituteId = req.params.instituteId
    const {aboveData,institutionpara,InstituteType,AxiosPlans} = req.body
    const institutePath = await AddInstituteData.findById(instituteId);

      if (!institutePath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      institutePath.listDataAccess.push({
        aboveData,institutionpara,InstituteType,AxiosPlans
      })
      await institutePath.save()

    res.status(200).send("User created successfully");
  } catch (e) {
    console.error(e.message, "ByListData");
    return res.status(500).json(e.message);
  }
});

app.put("/ByBatchData/:InstituteType", middleware, async (req, res) => {
  try {
    const InstituteType = req.params.InstituteType;
    console.log(InstituteType);

    // Check if the provided InstituteType exists
    const instituteExists = await AddUserByBatch.findOne({
      InstituteType: InstituteType,
    });

    if (!instituteExists) {
      return res.status(404).json("InstituteType not found");
    }

    // Update data for all users with the specified InstituteType
    const updateResult = await AddUserByBatch.findOneAndUpdate(
      { InstituteType: InstituteType },
      {
        $set: {
          BatchYear: req.body.BatchYear,
          SelectBatch: req.body.SelectBatch,
          AxiosPlans: req.body.AxiosPlans,
        },
      }
    );
    console.log(updateResult);

    return res.status(200).json("updated ");
  } catch (e) {
    console.error(e.message, "ByBatchData");
    return res.status(500).json(e.message);
  }
});

app.put("/ByListData/:InstituteType", middleware, async (req, res) => {
  try {
    const InstituteType = req.params.InstituteType;
    console.log(InstituteType);

    // Check if the provided InstituteType exists
    const instituteExists = await ByList.findOne({
      InstituteType: InstituteType,
    });

    if (!instituteExists) {
      return res.status(404).json("InstituteType not found");
    }

    // Update data for all users with the specified InstituteType
    const updateResult = await ByList.findOneAndUpdate(
      { InstituteType: InstituteType },
      {
        $set: {
          aboveData: req.body.aboveData,
          institutionpara: req.body.institutionpara,
          AxiosPlans: req.body.AxiosPlans,
        },
      }
    );
    console.log(updateResult);

    return res.status(200).json("updated ");
  } catch (e) {
    console.error(e.message, "ByListData");
    return res.status(500).json(e.message);
  }
});

app.get("/InstituteData123/:InstituteName", async (req, res) => {
  try {
    const InstituteName = req.params.InstituteName;

    // Check if the provided InstituteName exists
    const instituteData = await AddInstituteData.findOne({ InstituteName });

    if (!instituteData) {
      return res.status(404).json("InstituteName not found");
    }

    // Return the data for the specified InstituteName
    return res.status(200).json(instituteData);
  } catch (e) {
    console.error(e.message, "InstituteData123");
    return res.status(500).json(e.message);
  }
});

//Learn Path Data

 
app.post("/AddVideoPath", async (req, res) => {
 
  try {
    // Check if the VideofolderName already exists
    const existingVideo = await AddvideoData.findOne({
      VideofolderName: req.body.VideofolderName,
    });

    if (!existingVideo) {
      const AddVideo = new AddvideoData(req.body);

      await AddVideo.save();

      console.log(AddVideo);
      res.status(200).send("Video path added successfully");
    } else {
      res.status(400).json("Video path with the same name already exists");
    }
  } catch (e) {
    console.error(e.message, "AddVideoPath");
    return res.status(500).json(e.message);
  }
});

 
app.get("/allAddVideosData", async (req, res) => {
 
  try {
    const allVideos = await AddvideoData.find({});
    return res.status(200).json(allVideos);
  } catch (error) {
    console.error(error.message, "allAddVideosData");
    return res.status(500).json("Internal Server Error");
  }
});

 
app.put("/UpdateVideosDetails/:selectedvideopathId", async (req, res) => {
  try {
    const { selectedvideopathId } = req.params;
    const video = await AddvideoData.findByIdAndUpdate(selectedvideopathId, req.body);
 

      if (!video) {
        return res.status(404).json("Video Not Found");
      }

      return res.status(200).json("Video Folder updated successfully");
    } catch (error) {
      console.error(error.message, "UpdateVideosDetails");
      return res.status(500).json("Internal Server Error");
    }
  }
);

app.get("/DisplayIndividualVideo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const DisplayIndividualVideo = await AddvideoData.findById({ _id: id });

    if (!DisplayIndividualVideo) {
      return res.status(404).send("Video not Found!!!");
    }

    return res.send(DisplayIndividualVideo);
  } catch (error) {
    console.error(error.message, "DisplayIndividualVideo");
    return res.status(500).json("Internal Server Error");
  }
});

 
app.delete("/deleteVideo/:id" , async (req, res) => {
 
  try {
    const id = req.params.id; // Use req.params.id to get the instituteId
    const deletedVideo = await AddvideoData.findByIdAndRemove(id);

    if (deletedVideo) {
      return res.status(200).json("Video Folder deleted successfully");
    } else {
      return res.status(404).json("Video Folder not found");
    }
  } catch (e) {
    console.error(e.message, "deleteVideo");
    return res.status(500).json(e.message);
  }
});

//create videofile
 
app.post("/AddVideoFilesData/:videopathId", async (req, res) => {
 
  try {
    const videopathId = req.params.videopathId;
    const { VideofolderName, VideoTitleName, SourceName, Video1 } = req.body;

    const existingVideo = await AddvideoData.findById(videopathId);

    if (!existingVideo) {
      return res
        .status(404)
        .json({ msg: "VideoPath not found", status: "failed" });
    }
    const isVideoTitleName = existingVideo.videoFile.some(
      (each) => each.VideoTitleName === VideoTitleName
    );
    if (isVideoTitleName) {
      return res.status(400).json({
        msg: "VideoTitle with the same name already exists",
        status: "failed",
      });
    }
    const AddVideo = {
      VideofolderName,
      VideoTitleName,
      SourceName,
      Video1,
    };
    existingVideo.videoFile.push(AddVideo);
    await existingVideo.save();

    return res.json({ msg: "VideoFile added successfully", status: "success" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//delete videofiles
 
app.delete("/deleteVideofiles/:videopathId/:videofileId", async (req, res) => {
  try {
    const videopathId = req.params.videopathId;
    const videofileId = req.params.videofileId;
    const existingVideopath = await AddvideoData.findById(videopathId);
    if (!existingVideopath) {
      return res.status(404).json({ msg: 'Videopath not found', status: 'failed' });
    }
    const VideofileIndex = existingVideopath.videoFile.findIndex(
      (file) => file._id.toString() === videofileId
    );
    if (VideofileIndex === -1) {
      return res.status(404).json({ msg: 'Videofile not found', status: 'failed' });
    }
 

      existingVideopath.videoFile.splice(VideofileIndex, 1);
      await existingVideopath.save();
      return res.json({
        msg: "VideoFile deleted successfully",
        status: "success",
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);




app.get("/getSingleVideoData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleVideoData = await AddvideoData.findById({ _id: id });
    if(!singleVideoData){
      return res.status(404).send("video folder not found")
    }
    return res.send(singleVideoData)
  } catch (error) {
    console.error(error.message,"singleVideoData")
   return res.status(500).json("internal servererror")
}
});


//get videofiles with videopathid
 
app.get("/DisplayAllVideos/:videopathId", async (req, res) => {
 
  try {
    const videopathId = req.params.videopathId;
    const existingVideoPath = await AddvideoData.findById(videopathId);
    if (!existingVideoPath) {
      return res
        .status(404)
        .json({ msg: "VideoPath not found", status: "failed" });
    }

    const allVideos = existingVideoPath;
    return res.json({ allVideos, status: "success" });
  } catch (error) {
    console.error(error.message, "DisplayAllVideos");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
//get allvideofiles
app.get("/getAllVideoFiles", async (req, res) => {
  try {
    // Retrieve all documents in the AddvideoData collection
    const allVideos = await AddvideoData.find();

    // Extract and combine all videoFile arrays from the documents
    const allVideoFiles = allVideos.reduce(
      (acc, video) => acc.concat(video.videoFile),
      []
    );

    return res.json({ videoFiles: allVideoFiles, status: "success" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get("/foldersVideoData/:VideofolderName", async (req, res) => {
  try {
    const VideofolderName = req.params.VideofolderName;

    // Check if the provided InstituteName exists
    const FolderData = await videoFile.find({ VideofolderName });

    if (!FolderData) {
      return res.status(404).json("InstituteName not found");
    }

    // Return the data for the specified InstituteName
    return res.status(200).json(FolderData);
  } catch (e) {
    console.error(e.message, "foldersVideoData");
    return res.status(500).json(e.message);
  }
});
//Update videofiles
 
app.put("/UpdateVideofileDetails/:selectedvideopathId/:selectedVideofileId", async (req, res) => {
  try {
    const selectedvideopathId = req.params.selectedvideopathId;
 
      const selectedVideofileId = req.params.selectedVideofileId;
      const VideoTitleName = req.body.VideoTitle;
      const Video1 = req.body.videofile;

      const existingVideofile = await AddvideoData.findById(
        selectedvideopathId
      );

      if (!existingVideofile) {
        return res
          .status(404)
          .json({ msg: "Videopath not found", status: "failed" });
      }
      const videofileToUpdate =
        existingVideofile.videoFile.id(selectedVideofileId);

      if (!videofileToUpdate) {
        return res
          .status(404)
          .json({ msg: "Videofile not found", status: "failed" });
      }

      videofileToUpdate.VideoTitleName = VideoTitleName;
      videofileToUpdate.Video1 = Video1;

      await existingVideofile.save();
      return res.json({
        msg: "Videofile updated successfully",
        status: "success",
        updatedVideofile: videofileToUpdate,
      });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

// Learn-Path
// app.post("/addlearningpath", middleware, async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       learningPathTitle,
//       relevantSkillTags,
//       coverLetter,
//       difficultyLevel,
//       subscription,
//       price,
//       discount,
//       AboutLearnPath,
//       authorName,
//       hours,
//       minutes,
//       learningimg,
//       fileName,
//       requirements,
//     } = req.body;
//     const isLearningPathExist = await allLearningPaths.findOne({
//       learningPathTitle: learningPathTitle,
//     });
//     if (isLearningPathExist) {
//       return res.send({ msg: "Path Already Registered", status: "failed" });
//     }
//     let newLearningPath = new allLearningPaths({
//       learningPathTitle,
//       relevantSkillTags,
//       coverLetter,
//       difficultyLevel,
//       subscription,
//       price,
//       discount,
//       AboutLearnPath,
//       authorName,
//       hours,
//       minutes,
//       learningimg,
//       fileName,
//       requirements,
//     });
//     newLearningPath.save(); //saving mongodb collection
//     return res.send({ msg: "Path Created Successfully", status: "success" });
//   } catch (e) {
//     console.error(e.message, "addlearningpath");
//     res.status(500).send("Internal Server Error");
//   }
// });
app.post("/addlearningpath", async (req, res) => {
  console.log(req.body);
  try {
    const {
      learningPathTitle,
      relevantSkillTags,
      coverLetter,
      difficultyLevel,
      subscription,
      price,
      discount,
      AboutLearnPath,
      authorName,
      hours,
      minutes,
      learningimg,
      fileName,
      requirements,
      UploadVideoUrl,
    } = req.body;
    const isLearningPathExist = await allLearningPaths.findOne({
      learningPathTitle: learningPathTitle,
    });
    if (isLearningPathExist) {
      return res.send({ msg: "Path Already Registered", status: "failed" });
    }
    const CurrentTime = new Date();

    let newLearningPath = new allLearningPaths({
      learningPathTitle,
      relevantSkillTags,
      coverLetter,
      difficultyLevel,
      subscription,
      price,
      discount,
      AboutLearnPath,
      authorName,
      hours,
      minutes,
      learningimg,
      fileName,
      requirements,
      UploadVideoUrl,
      CurrentTime,
      
    });
    newLearningPath.save(); //saving mongodb collection
    return res.send({ msg: "Path Created Successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "addlearningpath");
    res.status(500).send("Internal Server Error");
  }
});

app.get("/alllearningpathsDetails", async (req, res) => {
  try {
    const allUsersDetails = await allLearningPaths.find();
    res.status(200).send(allUsersDetails);
  } catch (error) {
    console.error(error.message, "alllearningpathsDetails");
    res.status(500).json("Internal Server Error");
  }
});

//updatelearningpath

app.put("/updatelearningpath/:learningPathId", async (req, res) => {
  try {
    const learningPathId = req.params.learningPathId;
    const {
      learningPathTitle,
      relevantSkillTags,
      coverLetter,
      difficultyLevel,
      subscription,
      price,
      discount,
      AboutLearnPath,
      authorName,
      hours,
      minutes,
      learningimg,
      fileName,
      requirements,
      UploadVideoUrl,
    } = req.body;

    // Find the existing learning path by ID
    const existingLearningPath = await allLearningPaths.findById(
      learningPathId
    );

    if (!existingLearningPath) {
      return res
        .status(404)
        .json({ msg: "Learning path not found", status: "failed" });
    }

    // Update the properties of the existing learning path
    existingLearningPath.learningPathTitle = learningPathTitle;
    existingLearningPath.relevantSkillTags = relevantSkillTags;
    existingLearningPath.coverLetter = coverLetter;
    existingLearningPath.difficultyLevel = difficultyLevel;
    existingLearningPath.subscription = subscription;
    existingLearningPath.price = price;
    existingLearningPath.discount = discount;
    existingLearningPath.AboutLearnPath = AboutLearnPath;
    existingLearningPath.authorName = authorName;
    existingLearningPath.hours = hours;
    existingLearningPath.minutes = minutes;
    existingLearningPath.learningimg = learningimg;
    existingLearningPath.fileName = fileName;
    existingLearningPath.requirements = requirements;
    existingLearningPath.UploadVideoUrl = UploadVideoUrl;

    

    // Save the updated learning path document
    await existingLearningPath.save();

    return res.json({
      msg: "Learning path updated successfully",
      status: "success",
    });
  } catch (e) {
    console.error(e.message, "updatelearningpath");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

// Post Topics

app.post("/addTopic/:learningPathId", async (req, res) => {
  try {
    const learningPathId = req.params.learningPathId;
    const { topicName, description, publish, TopicTime } = req.body;

    // Find the existing learning path by ID
    const existingLearningPath = await allLearningPaths.findById(
      learningPathId
    );

    if (!existingLearningPath) {
      return res
        .status(404)
        .json({ msg: "Learning path not found", status: "failed" });
    }

    // Check if the topic with the same name already exists
    const isTopicExist = existingLearningPath.topics.some(
      (topic) => topic.topicName === topicName
    );

    if (isTopicExist) {
      return res.status(400).json({
        msg: "Topic with the same name already exists",
        status: "failed",
      });
    }

    // Create a new topic
    const newTopic = {
      topicName,
      description,
      publish,
      TopicTime: new Date(), // Assign the current date to TopicTime
    };
    console.log("topic", TopicTime);

    // Add the new topic to the "topics" array in the learning path
    existingLearningPath.topics.push(newTopic);

    // Save the updated learning path document
    await existingLearningPath.save();

    return res.json({ msg: "Topic added successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "addTopic");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get("/getTopic/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the topic by ID
    const topic = await allLearningPaths.findById(id);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found", status: "failed" });
    }

    // If the topic is found, send it in the response
    return res.send(topic);
  } catch (e) {
    console.error(e.message, "getTopic");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get(
  "/getTopic/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;

      // Find the existing learning path by ID
      const existingLearningPath = await allLearningPaths.findById(
        learningPathId
      );

      if (!existingLearningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the "topics" array
      const topic = existingLearningPath.topics.find(
        (t) => t._id.toString() === topicId
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Return the information about the topic
      return res.json({
        topicName: topic.topicName,
        description: topic.description,
        publish: topic.publish,
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "getTopic");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.put(
  "/updateTopic/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const { topicName, description, publish } = req.body;

      // Find the existing learning path by ID
      const existingLearningPath = await allLearningPaths.findById(
        learningPathId
      );

      if (!existingLearningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the index of the topic within the "topics" array
      const topicIndex = existingLearningPath.topics.findIndex(
        (t) => t._id.toString() === topicId
      );

      if (topicIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Update the properties of the existing topic
      existingLearningPath.topics[topicIndex].topicName = topicName;
      existingLearningPath.topics[topicIndex].description = description;
      existingLearningPath.topics[topicIndex].publish = publish;

      // Save the updated learning path document
      await existingLearningPath.save();

      return res.json({ msg: "Topic updated successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "updateTopic");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.post(
  "/addContentOfTopicsinlearningpath/:learningPathId",
  async (req, res) => {
    try {
      const { learningPathId } = req.params;
      const {
        topicName,
        contentTitle,
        contentdes,
        contentimg,
        publish,
        contentTime,
      } = req.body;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by name
      const topic = learningPath.topics.find(
        (t) => t.topicName.toString() === topicName
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Check if contentTitle already exists in the topic
      const existingContent = topic.content.find(
        (c) => c.contentTitle === contentTitle
      );

      if (existingContent) {
        return res.status(400).json({
          msg: "Content with the same title already exists",
          status: "failed",
        });
      }

      // Add the new content to the "content" array in the topic
      topic.content.push({
        _id: req.body._id,
        contentTitle,
        contentdes,
        contentimg,
        publish,
        contentTime: new Date(), // Use new Date() to store the current time
      });
      console.log(contentTime);
      // Save the updated learning path document
      await learningPath.save();

      return res
        .status(200)
        .json({ msg: "Content added successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "addContentOfTopicsinlearningpath");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.post(
  "/addContentOfTopicsinlearningpath/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const {
        topicContentname,
        contentTitle,
        contentdes,
        contentimg,
        publish,
      } = req.body;
      // const topicId = req.params.topicId;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Add the new content to the "content" array in the topic
      topic.content.push({
        topicContentname,
        contentTitle,
        contentdes,
        contentimg,
        publish,
      });

      // Save the updated learning path document
      await learningPath.save();

      return res
        .status(200)
        .json({ msg: "Content added successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "addContentOfTopicsinlearningpath");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
app.post(
  "/addContentOfTopicsinlearningpath/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const {
        topicContentname,
        contentTitle,
        contentdes,
        contentimg,
        publish,
      } = req.body;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Add the new content to the "content" array in the topic
      const newContent = {
        topicContentname,
        contentTitle,
        contentdes,
        contentimg,
        publish,
      };

      topic.content.push(newContent);

      // Save the updated learning path document
      await learningPath.save();

      return res.status(200).json({
        msg: "Content added successfully",
        status: "success",
        learningPathId: learningPath._id,
        topicId: topic._id,
        contentId: newContent._id, // Assuming you have a unique identifier for content
      });
    } catch (e) {
      console.error(e.message, "addContentOfTopicsinlearningpath");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.get("/getContentPaths/:learningPathId/:topicId", async (req, res) => {
  try {
    const { learningPathId, topicId } = req.params;

    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res
        .status(404)
        .json({ msg: "Learning path not found", status: "failed" });
    }
    const topic = learningPath.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({ msg: "topic not found", status: "failed" });
    }
    const contents = topic.content;

    // Return the learning path details, including topics and content
    return res.status(200).json(contents);
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get(
  "/getAllContents/:learningPathId/:topicId/:contentId",
  async (req, res) => {
    try {
      const { learningPathId, topicId, contentId } = req.params;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Find the content within the topic by ID
      const content = topic.content.id(contentId);

      if (!content) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Retrieve all contents data for the given learning path, topic, and content
      const allContentsData = topic.content.map((contentItem) => {
        // Modify the content data as needed
        // Modify the content data as needed
        return {
          id: contentItem.id,
          contentTitle: contentItem.contentTitle,
          contentdes: contentItem.contentdes,
          contentimg: contentItem.contentimg,
          publish: contentItem.publish,
          contentTime: contentItem.contentTime,
          // Add more properties as needed
        };
      });

      //server

      // Return the modified content data
      return res
        .status(200)
        .json({ contents: allContentsData, status: "success" });
    } catch (e) {
      console.error(e.message, "get all contents");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//getallcontentsbasedonlearningpathId and topicId
app.get('/getcontentsdetails/:learningPathId/:topicId', async (req, res) => {
  try {
    const { learningPathId, topicId } = req.params;

    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res.status(404).json({ msg: 'Learning path not found', status: 'failed' });
    }

    // Find the topic within the learning path
    const topic = learningPath.topics.find(t => t._id.toString() === topicId);

    if (!topic) {
      return res.status(404).json({ msg: 'Topic not found', status: 'failed' });
    }

    // Return the content array of the found topic
    res.json(topic.content || []);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});

app.get("/getContentPath/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(id);

    if (!learningPath) {
      return res
        .status(404)
        .json({ msg: "Learning path not found", status: "failed" });
    }

    // Return the learning path details, including topics and content
    return res.status(200).json(learningPath);
  } catch (e) {
    console.error(e.message, "getContentPath");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.put(
  "/updateContent/:learningPathId/:topicId/:contentTitle",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const contentTitleParam = req.params.contentTitle;
      const { contentTitle, contentdes, contentimg, publish } = req.body;

      // Find the existing learning path by ID
      const existingLearningPath = await allLearningPaths.findById(
        learningPathId
      );

      if (!existingLearningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = existingLearningPath.topics.find(
        (t) => t._id.toString() === topicId
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Check if the new content title already exists in the topic
      const contentTitleExists = topic.content.some(
        (c) =>
          c.contentTitle === contentTitle &&
          c.contentTitle !== contentTitleParam
      );

      if (contentTitleExists) {
        return res
          .status(400)
          .json({ msg: "Content title already exists", status: "failed" });
      }

      // Find the content item within the "content" array by contentTitle
      const contentItem = topic.content.find(
        (c) => c.contentTitle === contentTitleParam
      );

      if (!contentItem) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Update the properties of the existing content
      contentItem.contentTitle = contentTitle;
      contentItem.contentdes = contentdes;
      contentItem.contentimg = contentimg;
      contentItem.publish = publish;

      // Save the updated learning path document
      await existingLearningPath.save();

      return res.json({
        msg: "Content updated successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "updateContent");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.get(
  "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const { learningPathId, topicId } = req.params;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.find(
        (t) => t._id.toString() === topicId
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Return all content items in the specified topic
      return res.status(200).json(topic.content);
    } catch (e) {
      console.error(e.message, "get content");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.get(
  "/getSingledataContents/:learningPathId/:topicId/:contentTitle",
  async (req, res) => {
    try {
      const { learningPathId, topicId, contentTitle } = req.params;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.id(topicId);

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Find the content within the topic by contentTitle
      const content = topic.content.find(
        (contentItem) => contentItem.contentTitle === contentTitle
      );

      if (!content) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Modify the content data as needed
      const contentData = {
        id: content.id,
        contentTitle: content.contentTitle,
        contentdes: content.contentdes,
        contentimg: content.contentimg,
        publish: content.publish,
        contentTime: content.contentTime,
        // Add more properties as needed
      };

      // Return the modified content data
      return res.status(200).json({ contentData });
    } catch (e) {
      console.error(e.message, "get content by title");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.delete("/onselectedLearningPath/:_id", async (req, res) => {
  try {
    const _id = req.params._id; // Fix: Extract _id from req.params
    const deletedLearningPath = await allLearningPaths.findByIdAndDelete(
      _id,
      req.body
    );

    console.log(deletedLearningPath);

    if (!deletedLearningPath) {
      return res.status(404).json("Not Found!");
    }

    return res.status(200).json("Deleted Successfully");
  } catch (error) {
    console.error(error, "/onselectedLearningPath");
    return res.status(500).json("Internal Server Error");
  }
});

// //deleteTopicinLearningPath
app.delete(
  "/onselectedTopicinLearningPath/:learningPathId/:topicId",

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the index of the topic within the "topics" array
      const topicIndex = learningPath.topics.findIndex(
        (t) => t._id.toString() === topicId
      );

      if (topicIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Remove the topic and all its content from the "topics" array
      learningPath.topics.splice(topicIndex, 1);

      // Save the updated learning path document
      await learningPath.save();

      return res.status(200).json({
        msg: "Topic and content deleted successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "/onselectedTopicinLearningPath");
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.delete(
  "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentTitle",
  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const contentTitle = req.params.contentTitle;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.find(
        (t) => t._id.toString() === topicId
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Find the index of the content item within the "content" array
      const contentIndex = topic.content.findIndex(
        (c) => c.contentTitle === contentTitle
      );

      if (contentIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Remove the content item from the "content" array
      topic.content.splice(contentIndex, 1);

      // Save the updated learning path document
      await learningPath.save();

      return res
        .status(200)
        .json({ msg: "Content deleted successfully", status: "success" });
    } catch (e) {
      console.error(e.message, "/onselectedContentinTopicinLearningPat");

      console.error(
        e.message,
        "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentTitle"
      );

      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

// Category

app.post("/categories", async (req, res) => {
  try {
    const newCategory = new Categories(req.body);
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const allCategories = await Categories.find();
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories/:_id", async (req, res) => {
  const Id = req.params._id;

  try {
    const category = await Categories.findById(Id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    const deletedCategory = await Categories.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// signup admin

const bcrypt = require('bcrypt'); // Require bcrypt for password hashing

// ... (other code remains the same)

// app.post("/signupdata", async (req, res) => {
//   console.log(req.body);

//   try {
//     const user = await signupData.findOne({ email: req.body.email });

//     if (!user) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
//       const newUser = {
//         "firstname": req.body.firstname,
//         "lastname": req.body.lastname,
//         "email": req.body.email,
//         "organizationname": req.body.organizationname,
//         "mobilenumber": req.body.mobilenumber,
//         "password": hashedPassword, // Store hashed password in the database
//       };

//       const userDetails = await signupData.create(newUser);
//       console.log(userDetails);
//       return res.status(200).send("user created successfully");
//     } else {
//       return res.status(400).json("user already registered");
//     }
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).send("server error");
//   }
// });

// app.post("/loginupdata", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await loginupData.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ message: "Email not found" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const payload = {
//       id: user._id
//     };
//     let token = jwt.sign(payload, 'jalaiah', { expiresIn: '24hr' });
//     console.log(token);
//     return res.status(200).json({ message: "User Login Success", token: token });

//   } catch (error) {
//     console.error(error.message, "loginupData");
//     return res.status(500).json({
//       message: "An error occurred on the server. Please try again later.",
//     });
//   }
// });


// app.post("/signupData", async (req, res) => {

//   try {
//     const {
//       firstname,
//       lastname,
//       email,
//       organizationname,
//       mobilenumber,
//       password





//     } = req.body;
//     let newUser = new signupData({
//       firstname: firstname,
//       lastname: lastname,
//       email: email,
//       organizationname:organizationname,
//       mobilenumber:mobilenumber,
//       password:password




//     });
//     const isUserExit = await signupData.findOne({ email: email });

//     newUser.save();
//     res.send("user created succesfully");
//   }


//   catch (e) {
//     console.log(e.message);
//     res.send("Internal server error")
//   }
// });

// app.post("/signupdata", async (req, res) => {
//   console.log(req.body);



//   try {


//     const user = await signupData.findOne({email: req.body.email })   // mongo db condition
//     console.log(user)

//     if (!user) {  // or if(user === undefined)

//       // user not found excutes below code


//       const newUser = {

//         "firstname": req.body.firstname,
//         "lastname": req.body.lastname,
//         "email": req.body. email,
//         "organizationname": req.body.organizationname,
//         "mobilenumber": req.body.mobilenumber,
//         "password": req.body.password

//       };

//       const userDetails = await signupData.create(newUser)   //  POSTING TO COLLECTION OR MODEL
//       console.log(userDetails)

//       res.status(200).send("user created successfully")


//     } else {

//       // if user mail id is founded send below response
//       res.status(400).json("user already registered")

//     }

//   }
//   catch (e) {
//     console.log(e.message);
//     return res.send("server error")
//   }
// });

// login up admin



// app.post("/loginupData", async (req, res) => {

//   try {
//     const {
//       email1,
//       password1
     





//     } = req.body;
//     let newUser = new loginupData({
//       email1:email1,
//       password1:password1




//     });
//     const isUserExit = await loginupData.findOne({ email1: email1 });

//     newUser.save();
//     res.send("login created succesfully");
//   }

//   catch (e) {
//     console.log(e.message);
//     res.send("Internal server error")
//   }
// });

// app.post("/loginupdata", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await loginupData.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Email not found" });
//     }
//     if ( password  !== user.password ) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }
   
//     const payload = {
//       id: user._id
//     }
//     let token = jwt.sign(payload, 'jalaiah', { expiresIn: '24hr' })
//         console.log(token);
//         return res.status(200).json({ message: "User Login Success", token: token });
  
//   } catch (error) {
//     console.error(error.message, "loginupData");
//     res.status(500).json({
//       message: "An error occurred on the server. Please try again later.",
//     });
//   }
// });


// app.post("/loginupdata", async (req, res) => {
//   const { email1, password1 } = req.body
//   const isUserExit = await loginupData.findOne({ email1, password1 })


//   if (isUserExit) {
//     if (password1 === isUserExit.password1) 
//     {
//       let payload = {
//         user: isUserExit.id,
//       };
//       jwt.sign(payload, 'jwtpassword', { expiresIn: 36000000 },
//         (err, token) => {
//           if (err) throw err;
//           return res.json({ token });



//         }
//         );

//     }
//     else {
//       return res.send("password not matched");
//     }


//   }

// });


app.post("/signupdata", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      organizationname: req.body.organizationname,
      mobilenumber: req.body.mobilenumber,
      password: hashedPassword, // Store hashed password in the database
    };

    const userDetails = await signupData.create(newUser);
    console.log(userDetails);
    return res.status(200).send("User created successfully");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AddInstituteData.findOne({ 'InstituteBatchYear.InsituteBatch.InstituteUsersList.userEmail': email });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    let isPasswordCorrect = false;

    user.InstituteBatchYear.forEach(batchYear => {
      batchYear.InsituteBatch.forEach(batch => {
        const userInBatch = batch.InstituteUsersList.find(u => u.userEmail === email);
        if (userInBatch && userInBatch.Password === password) {
          isPasswordCorrect = true;
        }
      });
    });

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const payload = {
      id: user._id
    };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '24hr' });

    return res.status(200).json({ message: "User Login Success", token: token });

  } catch (error) {
    console.error(error.message, "loginupData");
    return res.status(500).json({
      message: "An error occurred on the server. Please try again later.",
    });
  }
});


// Category

// Topic

app.post("/topic", async (req, res) => {
  try {
    const newCategory = new Topic(req.body);
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/topic/:id", async (req, res) => {
  try {
    const updatedCategory = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/topic", async (req, res) => {
  try {
    const allCategories = await Topic.find();
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/topic/:_id", async (req, res) => {
  const topicId = req.params._id;

  try {
    const topic = await Topic.findById(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/topic/:id", async (req, res) => {
  try {
    const deletedCategory = await Topic.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get(
  "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentTitle",
  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const contentTitle = req.params.contentTitle;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(learningPathId);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.find(
        (t) => t._id.toString() === topicId
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Find the index of the content item within the "content" array
      const contentIndex = topic.content.findIndex(
        (c) => c.contentTitle === contentTitle
      );

      if (contentIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Remove the content item from the "content" array
      // topic.content.splice(contentIndex, 1);

      // Save the updated learning path document
      await learningPath.save();

      return res
        .status(200)
        .json({ msg: "Contens Get successfully", status: "success" });
    } catch (e) {
      console.error(
        e.message,
        "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentTitle"
      );
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);
//access given
app.post("/AccessGiven/:InstituteId/:batchyearId/:batchId", async (req, res) => {
  try {
    const InstituteId = req.params.InstituteId;
 
    const BatchyearId = req.params.batchyearId;
    const BatchId = req.params.batchId;
    const Access = req.body.Access;    
  
    const institutePath = await AddInstituteData.findById(InstituteId);

    if (!institutePath) {
      return res.status(404).json({ msg: "Institute not found", status: "failed" });
 
    }
    const BatchYear = institutePath.InstituteBatchYear.id(BatchyearId);

    if (!BatchYear) {
      return res
        .status(404)
        .json({ msg: "BatchYear not found", status: "failed" });
    }

    const Batch = BatchYear.InsituteBatch.id(BatchId);

    if (!Batch) {
      return res
        .status(404)
        .json({ msg: "Topic not found", status: "failed" });
    }
    Batch.LearningPathAccess = Access
    await institutePath.save();
    return res
      .status(200)
      .json({ msg: "Access added successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "AddAccess");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
 
}
);


// //accessview 

app.post("/AccessView/:InstituteId/:batchyearId/:batchId", async (req, res) => {
  try {
    const InstituteId = req.params.InstituteId;
 
    const BatchyearId = req.params.batchyearId;
    const BatchId = req.params.batchId;
    const Access = req.body.Access;    
  
    const institutePath = await AddInstituteData.findById(InstituteId);

    if (!institutePath) {
      return res.status(404).json({ msg: "Institute not found", status: "failed" });
 
    }
    const BatchYear = institutePath.InstituteBatchYear.id(BatchyearId);

    if (!BatchYear) {
      return res
        .status(404)
        .json({ msg: "BatchYear not found", status: "failed" });
    }

    const Batch = BatchYear.InsituteBatch.id(BatchId);

    if (!Batch) {
      return res
        .status(404)
        .json({ msg: "Topic not found", status: "failed" });
    }
    Batch.AccessView = AccessView
    await institutePath.save();
    return res
      .status(200)
      .json({ msg: "Access added successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "AddAccess");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
 
}
);




//addpostQuestions
app.post('/addQuestion/:learningPathId/:topicId/:contentTitle', async (req, res) => {
  const { learningPathId, topicId, contentTitle } = req.params;
  const { question, inputFormat, outputFormat } = req.body;

  try {
    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Find the content within the topic by title
    const content = topic.content.find(
      (contentItem) => contentItem.contentTitle === contentTitle
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Add the question to the content
    content.question.push({ question, inputFormat, outputFormat });

    // Save the updated learning path document
    await learningPath.save();

    // Respond with a success message
    res.json({ message: 'Question added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//get all Questions
app.get('/getQuestions/:learningPathId/:topicId/:contentTitle', async (req, res) => {
  const { learningPathId, topicId, contentTitle } = req.params;

  try {
    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Find the content within the topic by title
    const content = topic.content.find(
      (contentItem) => contentItem.contentTitle === contentTitle
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Retrieve only the questions for the specified content
    const questions = content.question;

    // Respond with the questions
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//delete Questions
app.delete('/deleteQuestion/:learningPathId/:topicId/:contentTitle/:questionId', async (req, res) => {
  const { learningPathId, topicId, contentTitle, questionId } = req.params;

  try {
    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Find the content within the topic by title
    const content = topic.content.find(
      (contentItem) => contentItem.contentTitle === contentTitle
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Find the question within the content by ID and remove it
    const questionIndex = content.question.findIndex(q => q._id.toString() === questionId);
    if (questionIndex !== -1) {
      content.question.splice(questionIndex, 1);
    } else {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Save the updated learning path document
    await learningPath.save();

    // Respond with a success message
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
});


//get allcontentTitle
app.get("/getAllContentTitles/:learningPathId/:topicId", async (req, res) => {
  try {
    const { learningPathId, topicId } = req.params;

    // Find the learning path by ID
    const learningPath = await allLearningPaths.findById(learningPathId);

    if (!learningPath) {
      return res.status(404).json({ msg: "Learning path not found", status: "failed" });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.topics.find(t => t._id.toString() === topicId);

    if (!topic) {
      return res.status(404).json({ msg: "Topic not found", status: "failed" });
    }

    // Retrieve all contentTitles from the topic
    const contentTitles = topic.content.map(contentItem => contentItem.contentTitle);

    return res.status(200).json({ contentTitles, status: "success" });
  } catch (e) {
    console.error(e.message, "/getAllContentTitles");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
 

app.post("/compile", async (req, res) => {
  try {
    const { code, language, input } = req.body;
    const adjustedLanguage = language === "python" ? "py" : language;

    const data = {
      code: code,
      language: adjustedLanguage,
      input: input,
    };

    const config = {
      method: "post",
      url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    res.status(response.status).send(response.data);
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(error.response?.status || 500).send("Internal Server Error");
  }
});

// ===========================

 
app.use('/v6', require('./Routes/practiceTestRoutes'))
app.use('/v7', require('./Routes/PracticeRoutes'))
app.use('/v5', require('./Routes/CategoriesRoutes'))
app.use("/v1", require('./Routes/ChapterRoutes')) //api routes
app.use('/v1',  require('./Routes/MCQRoutes'));
app.use("/v2", require('./Routes/SubjectsRoutes')) 
app.use('/v2',paragMCQRouter)
app.use('/v4',require('./Routes/CodeingBasic'))
app.use('/U1',require('./Routes/assessement'));
app.use('/U2',require('./Routes/blogs'));
 
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
app.use("/v6", require("./Routes/practiceTestRoutes"));
app.use("/v1", require("./Routes/ChapterRoutes")); //api routes
app.use("/v1", require("./Routes/MCQRoutes"));
app.use("/v2", require("./Routes/SubjectsRoutes"));
app.use("/v2", paragMCQRouter);
app.use("/v4", require("./Routes/CodeingBasic"));
app.use("/U1", require("./Routes/assessement"));
app.use("/U2", require("./Routes/blogs"));

//delete categoriesaccess
app.delete("/categoriesAccessDelete/:categoryId/:accessId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const accessId = req.params.accessId;

    // Find the category by ID
    const category = await Categories.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }

    // Find the index of the access detail within the "AccessDetails" array
    const accessIndex = category.AccessDetails.findIndex(
      (access) => access._id.toString() === accessId
    );

    if (accessIndex === -1) {
      return res.status(404).json({ msg: "Access detail not found", status: "failed" });
    }

    // Remove the access detail from the "AccessDetails" array
    category.AccessDetails.splice(accessIndex, 1);

    // Save the updated category document
    await category.save();

    return res.status(200).json({
      msg: "Access deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error(error.message, "/categoriesAccessDelete");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
// GET endpoint to fetch assessments for a specific category
app.get("/categories/:categoryId/assessments", async (req, res) => {
  try {
    // Extract the categoryId from the request parameters
    const categoryId = req.params.categoryId;

    // Find the category by ID
    const category = await Categories.findById(categoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }

    // Extract and return the assessments from the category
    const assessments = category.Assessment;

    res.status(200).json({ assessments, status: "success" });
  } catch (error) {
    console.error(error.message, "/categories/:categoryId/assessments");
    res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
//umadevi

app.post("/assessment/:selectedCategoryId", async (req, res) => {
  try {
  const {assessmentname,
      nooftimes,
      assessmentpassword,
      exametype,
      cutofftype,
      questionselection,
      assessmentreport,
      assessmentflow,
      assessmentadaptiveness  } = req.body;
  const CategoryId = req.params.selectedCategoryId

  const CategoryPath = await Categories.findById(CategoryId);

  if (!CategoryPath) {
    return res.status(404).json({ msg: "CategoryPath not found", status: "failed" });
  }
  const isCategoryExist = CategoryPath.Assessment.some(
      (each) => each.assessmentname === assessmentname
    );

    if (isCategoryExist) {
      return res.status(400).json({
        msg: "Batchyear with the same Year already exists",
        status: "failed",
      });
    }

 const newAccessDetails = {
  assessmentname,
    nooftimes,
    assessmentpassword,
    exametype,
    cutofftype,
    questionselection,
    assessmentreport,
    assessmentflow,
    assessmentadaptiveness  
};
CategoryPath.Assessment.push(newAccessDetails); 
await CategoryPath.save();
    return res
      .status(200)
      .json({ msg: "User added successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "assessment");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
}
);
//get all assement
app.get('/assessments', async (req, res) => {
  try {
    const allAssessments = await Categories.find({}, 'Assessment -_id'); // Exclude _id field
    res.json(allAssessments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/assessmentqestion/:selectedCategoryId/:assessementId', async (req, res) => {
  const { selectedCategoryId, assessementId } = req.params;
  const {  qustioncount,
          totalqustion,
          duration,
          percentage,
          modelname,
          maxmarks } = req.body;

  try {
    // Find the learning path by ID
    const learningPath = await Categories.findById(selectedCategoryId);

    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.Assessment.id(assessementId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    // Add the question to the content
    topic.Qustionscount.push({ qustioncount,
      totalqustion,
      duration,
      percentage,
      modelname,
      maxmarks  });

    // Save the updated learning path document
    await learningPath.save();

    // Respond with a success message
    res.json({ message: 'Question added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post(
  "/Assessmentsettings/:selectedCategoryId/:assessementId",
  async (req, res) => {
    const { selectedCategoryId, assessementId } = req.params;
    const { Enable, Restrict, Tab, assessmentTabs } = req.body;

    try {
      const institutePath = await Categories.findById(selectedCategoryId);

      if (!institutePath) {
        return res.status(404).json({
          msg: "Learning path not found",
          status: "failed",
        });
      }

      const assessment = institutePath.Assessment.id(assessementId);

      if (!assessment) {
        return res.status(404).json({
          msg: "Assessment not found",
          status: "failed",
        });
      }
      if (!assessment.Assessmentsettings) {
        assessment.Assessmentsettings = [];
      }
      assessment.Assessmentsettings.push({
        Enable,
        Restrict,
        Tab,
        assessmentTabs,
      });
      await institutePath.save();

      return res.status(200).json({
        msg: "Assessment settings added successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "Assessmentsettings");
      return res.status(500).json({
        msg: "Internal Server Error",
        status: "failed",
      });
    }
  }
);

app.post(
  "/Questions/:selectedCategoryId/:assessementId",
  async (req, res) => {
    const { selectedCategoryId, assessementId } = req.params;
    const { questions } = req.body;


    try {
      const institutePath = await Categories.findById(selectedCategoryId);

      if (!institutePath) {
        return res.status(404).json({
          msg: "Learning path not found",
          status: "failed",
        });
      }

      const assessment = institutePath.Assessment.id(assessementId);

      if (!assessment) {
        return res.status(404).json({
          msg: "Assessment not found",
          status: "failed",
        });
      }
      if (!assessment.Questions) {
        assessment.Questions = [];
      }
      assessment.Questions.push(
        ...questions
      );
      await institutePath.save();

      return res.status(200).json({
        msg: "Questions added successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "Adduser");
      return res.status(500).json({
        msg: "Internal Server Error",
        status: "failed",
      });
    }
  }
);

app.get("/getIndiVIDUAL/:selectedCategoryId", async (req, res) => {
  try {
    const { selectedCategoryId } = req.params;
    const category = await Categories.findById(selectedCategoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }
    

    return res.status(200).json({ category, status: "success" });
  } catch (e) {
    console.error(e.message, "/getassessment");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get("/getassessment/:selectedCategoryId/:assessmentId", async (req, res) => {
  try {
    const { selectedCategoryId, assessmentId } = req.params;
    const category = await Categories.findById(selectedCategoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }
    const assessment = category.Assessment.find(A => A._id.toString() === assessmentId);

    if (!assessment) {
      return res.status(404).json({ msg: "Assessment not found", status: "failed" });
    }

    return res.status(200).json({ assessment, status: "success" });
  } catch (e) {
    console.error(e.message, "/getassessment");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.put("/userchangepassword", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
      const user = await signupData.findOne({ email });

      if (!user) {
          return res.status(401).json({ message: "Email not found" });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: "Incorrect current password" });
      }

      // Hash the new password before updating
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await signupData.findByIdAndUpdate(user._id, { password: hashedNewPassword });

      // Optionally, you can generate a new JWT token for the user
      const payload = {
          id: user._id
      };
      const newToken = jwt.sign(payload, 'siva', { expiresIn: '24hr' });

      return res.status(200).json({ message: "Password changed successfully", newToken });
  } catch (error) {
      console.error(error.message, "changePassword");
      return res.status(500).json({
          message: "An error occurred on the server. Please try again later.",
      });
  }
});
//update assessment
app.put("/updateassessment/:selectedCategoryId", async (req, res) => {
  try {
    const {
      assessmentname,
      nooftimes,
      assessmentpassword,
      exametype,
      cutofftype,
      questionselection,
      assessmentreport,
      assessmentflow,
      assessmentadaptiveness
    } = req.body;
    
    const categoryId = req.params.selectedCategoryId;

    const categoryPath = await Categories.findById(categoryId);

    if (!categoryPath) {
      return res.status(404).json({ msg: "CategoryPath not found", status: "failed" });
    }
    categoryPath.Assessment= {
      assessmentname,
      nooftimes,
      assessmentpassword,
      exametype,
      cutofftype,
      questionselection,
      assessmentreport,
      assessmentflow,
      assessmentadaptiveness
    };
    
    await categoryPath.save();

    return res
      .status(200)
      .json({ msg: "Assessment fields update successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "assessment");
    return res
      .status(500)
      .json({ msg: "Internal Server Error", status: "failed" });
  }
});
app.put(
  "/Assessmentsettings/:selectedCategoryId/:assessementId",
  async (req, res) => {
    const { selectedCategoryId, assessementId } = req.params;
    const { Enable, Restrict, Tab, assessmentTabs } = req.body;

    try {
      const institutePath = await Categories.findById(selectedCategoryId);

      if (!institutePath) {
        return res.status(404).json({
          msg: "Learning path not found",
          status: "failed",
        });
      }

      const assessment = institutePath.Assessment.id(assessementId);

      if (!assessment) {
        return res.status(404).json({
          msg: "Assessment not found",
          status: "failed",
        });
      }
      assessment.Assessmentsettings={
        Enable,
        Restrict,
        Tab,
        assessmentTabs,
      };
      await institutePath.save();

      return res.status(200).json({
        msg: "Assessment settings update successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "Assessmentsettings");
      return res.status(500).json({
        msg: "Internal Server Error",
        status: "failed",
      });
    }
  }
);
app.put(
  "/Questions/:selectedCategoryId/:assessementId",
  async (req, res) => {
    const { selectedCategoryId, assessementId } = req.params;
    const { questions } = req.body;
    

    try {
      const institutePath = await Categories.findById(selectedCategoryId);

      if (!institutePath) {
        return res.status(404).json({
          msg: "Learning path not found",
          status: "failed",
        });
      }

      const assessment = institutePath.Assessment.id(assessementId);

      if (!assessment) {
        return res.status(404).json({
          msg: "Assessment not found",
          status: "failed",
        });
      }
      if (!assessment.Questions) {
        assessment.Questions = [];
      }
      assessment.Questions={
        questions
      };
      await institutePath.save();

      return res.status(200).json({
        msg: "Questions update successfully",
        status: "success",
      });
    } catch (e) {
      console.error(e.message, "Adduser");
      return res.status(500).json({
        msg: "Internal Server Error",
        status: "failed",
      });
    }
  }
);
//delete assessment
app.delete('/deletessessment/:selectedCategoryId/:assessmentId', async (req, res) => {
  const { selectedCategoryId, assessmentId } = req.params;
  try {
    const CategoriesPath = await Categories.findById(selectedCategoryId);
    if (!CategoriesPath) {
      return res.status(404).json({ error: `CategoriesPath with ID ${selectedCategoryId} not found` });
    }
    const assessmentIndex = CategoriesPath.Assessment.findIndex(assessment => assessment._id == assessmentId);

    if (assessmentIndex === -1) {
      return res.status(404).json({ error: `assessment with ID ${assessmentId} not found in the learning path` });
    }
    CategoriesPath.Assessment.splice(assessmentIndex, 1)
    await CategoriesPath.save();

    res.json({ message: 'assessment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//keshav api
app.get("/singleLearningPath/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const singleLearningPath = await allLearningPaths.findById({ _id: id });
    res.status(200).send(singleLearningPath);
  } catch (error) {
    res.send(error);
  }
});

//umadevi userdashboardapi
app.get("/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    // Find user by email
    const user = await AddInstituteData.findOne({ 'InstituteBatchYear.InsituteBatch.InstituteUsersList.userEmail': email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let userDetails = [];

    user.InstituteBatchYear.forEach(batchYear => {
      batchYear.InsituteBatch.forEach(batch => {
        const userInBatch = batch.InstituteUsersList.find(u => u.userEmail === email);
        if (userInBatch) {
          const detail = {
            InstituteName: user.InstituteName,
            BatchYear: batchYear.BatchYear,
            Batch: batch.Batch,
            InstituteUsersList: userInBatch
          };
          userDetails.push(detail);
        }
      });
    });

    return res.status(200).json({ userDetails });

  } catch (error) {
    console.error(error.message, "userdata");
    return res.status(500).json({
      message: "An error occurred on the server. Please try again later.",
    });
  }
});


//sriramapis

app.get("/getassessments/:selectedCategoryId", async (req, res) => {
  try {
    const { selectedCategoryId } = req.params;
    const category = await Categories.findById(selectedCategoryId);

    if (!category) {
      return res.status(404).json({ msg: "Category not found", status: "failed" });
    }

    const assessments = category.Assessment;

    return res.status(200).json({ assessments, status: "success" });
  } catch (e) {
    console.error(e.message, "/getassessments");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get("/getallassessments", async (req, res) => {
  try {
    // Assuming you have a MongoDB model named 'AssessmentModel'
    const assessments = await Categories.find({}, { Assessment: 1 });

    return res.status(200).json({ assessments, status: "success" });
  } catch (e) {
    console.error(e.message, "/getallassessments");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});

app.get("/getassessmentscategories", async (req, res) => {
  try {
    // Assuming you have a MongoDB model named 'AssessmentModel'
    const assessments = await Categories.find();

    return res.status(200).json({ assessments, status: "success" });
  } catch (e) {
    console.error(e.message, "/getallassessments");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});




app.get('/assessmentquestion/:selectedCategoryId/:assessmentId', async (req, res) => {
  const { selectedCategoryId, assessmentId } = req.params;

  try {
    // Find the learning path by ID
    // const learningPath = await Categories.findById(selectedCategoryId);
    const learningPath = await Categories.findById(selectedCategoryId).populate('Assessment.Qustionscount');


    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    // Find the topic within the learning path by ID
    const topic = learningPath.Assessment.id(assessmentId);

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Retrieve the list of questions from the topic
    const questions = topic.Qustionscount;

    // Respond with the list of questions
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//sivacode apis
app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "Missing id query param" });
  }
  try {
    const job = await Job.findById(jobId);

    if (job === undefined) {
      return res.status(400).json({ success: false, error: "Invalid job id" });
    }

    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

app.post("/run", async (req, res) => {
  const { input, language = "cpp", code } = req.body;

  console.log("Received request for language:", language);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  try {
    const filepath = await generateFile(language, code, input);

    const job = await new Job({ language, filepath }).save();
    const jobId = job._id;
    console.log("Job created:", job);

    job.startedAt = new Date();

    let output;

    switch (language.toLowerCase()) {
      case "c":
        output = await executeC(filepath);
        break;
      case "cpp":
        output = await executeCpp(filepath);
        break;
      case "py":
        output = await executePy(filepath);
        break;
      case "java":
        output = await executeJava(filepath);
        break;
      case "ruby":
        output = await executeRuby(filepath);
        break;
      case "javascript":
        output = await executeJavaScript(filepath);
        break;
      default:
        throw new Error("Unsupported language!");
    }

    job.completedAt = new Date();
    job.status = "success";
    job.output = output;

    await job.save();

    console.log("Job completed:", job);

    // Send the response after completing the job
    res.status(201).json({ success: true, jobId });
  } catch (err) {
    console.error("Error in /run API:", err);

    if (err instanceof Error && err.message === "Unsupported language!") {
      return res
        .status(400)
        .json({ success: false, error: "Unsupported language!" });
    }

    // Handle other errors
    let job;

    if (job) {
      job.completedAt = new Date();
      job.status = "error";
      job.output = JSON.stringify(err);
      await job.save();
      console.log("Job with error:", job);
    }

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//getvideoswithcombined learningpath and videopath
app.get('/coursesvideossectionwise/:learningPathTitle', async (req, res) => {
  try {
    const learningPathTitle = req.params.learningPathTitle;
console.log(learningPathTitle)
    const learningPath = await allLearningPaths.findOne({ learningPathTitle });

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }
    const videofolderName = learningPath.learningPathTitle;

    const videos = await AddvideoData.findOne({ VideofolderName: videofolderName });

    if (!videos) {
      return res.status(404).json({ message: 'Videos not found for the learning path' });
    }

    res.json({ videos });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put("/UpdatedashbordUserPassword/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.body.password;

    // Find the user by email
    const user = await AddInstituteData.findOne({ 'InstituteBatchYear.InsituteBatch.InstituteUsersList.userEmail': email });

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: "failed" });
    }

    // Update the password
    user.InstituteBatchYear.forEach(batchYear => {
      batchYear.InsituteBatch.forEach(batch => {
        const userInBatch = batch.InstituteUsersList.find(u => u.userEmail === email);
        if (userInBatch) {
          userInBatch.Password = password;
        }
      });
    });

    // Save the updated user data
    await user.save();

    return res.status(200).json({ msg: "Password updated successfully", status: "success" });
  } catch (e) {
    console.error(e.message, "UpdateUserPassword");
    return res.status(500).json({ msg: "Internal Server Error", status: "failed" });
  }
});
