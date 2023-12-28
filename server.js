const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userData = require("./Model/userData");
const jwt = require("jsonwebtoken");
const middleware = require("./Middlware");
const AddInstituteData = require("./Model/AddInstituteData");
const AddUsersData = require("./Model/StudentsData");
const AddUserByBatch = require("./Model/ByBatch");
const ByList = require("./Model/ByList");
const AddvideoData = require("./Model/LearnPath/Addvideo");
const videoFile = require("./Model/LearnPath/AddVideoFile");
// const allLearningPaths = require("./Model/LearnPath/");
const paragMCQRouter = require('./Routes/ParagRoutes');
const Categories = require("./Model/categories");
const Topic = require("./Model/topic");

// const bodyParser = require("body-parser");

const app = express();
const port = 1412;

const mogoURL =
  // "mongodb+srv://badasiva22:Siva991276@cluster0.iis7lrd.mongodb.net/perfex-stack-project?retryWrites=true&w=majority";
  "mongodb+srv://pathlavathkishan77495:kishan789@cluster14.lafg4t1.mongodb.net/empDetails?retryWrites=true&w=majority"
  
app.use(express.json());
app.use(cors({ origin: "*" }));
// app.use(bodyParser.json());

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
      user: user._id,
    };
    jwt.sign(payload, "jwtpassword", { expiresIn: 36000000 }, (err, token) => {
      if (err) {
        throw err;
      }

      res.json({ token });
    });
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

//Add Users
app.post("/AddUsers", middleware, async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await AddUsersData.findOne({}, null, {
      sort: { Sno: -1 },
    });

    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }

    const user = await AddUsersData.findOne({
      userEmail: req.body.userEmail,
    });

    if (!user) {
      const UserDataDetails = {
        Sno: newSno, // Use the newly calculated ID
        Regdid: req.body.Regdid,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        userEmail: req.body.userEmail,
        userNumber: req.body.userNumber,
        BatchYear: req.body.BatchYear,
        SelectBatch: req.body.SelectBatch,
        InstituteType: req.body.InstituteType,
        AxiosPlans: req.body.AxiosPlans,
        Password: req.body.Password,
        Status: req.body.Status,
        ExpiryDate: req.body.ExpiryDate,
      };
      const UserDetailsdata = await AddUsersData.create(UserDataDetails);
      //siva

      console.log(UserDetailsdata);
      res.status(200).send("User created successfully");
    } else {
      res.status(400).json("User with the same email already registered");
    }
  } catch (e) {
    console.error(e.message, "AddUsers");
    return res.status(500).json(e.message);
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

app.post("/ByBatchData", middleware, async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await AddUserByBatch.findOne({}, null, {
      sort: { Sno: -1 },
    });
    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }
    const UserDataDetails = {
      Sno: newSno, // Use the newly calculated ID
      BatchYear: req.body.BatchYear,
      SelectBatch: req.body.SelectBatch,
      InstituteType: req.body.InstituteType,
      AxiosPlans: req.body.AxiosPlans,
    };
    const ByBatchdata = await AddUserByBatch.create(UserDataDetails);
    //siva

    console.log(ByBatchdata);
    res.status(200).send("User created successfully");
  } catch (e) {
    console.error(e.message, "ByBatchData");
    return res.status(500).json(e.message);
  }
});

app.post("/ByListData", middleware, async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await ByList.findOne({}, null, {
      sort: { Sno: -1 },
    });
    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }
    const UserDataDetails = {
      Sno: newSno, // Use the newly calculated ID
      aboveData: req.body.aboveData,
      institutionpara: req.body.institutionpara,
      InstituteType: req.body.InstituteType,
      AxiosPlans: req.body.AxiosPlans,
    };
    const ByListdata = await ByList.create(UserDataDetails);
    //siva

    console.log(ByListdata);
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

app.post("/AddVideoPath", middleware, async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await AddvideoData.findOne({}, null, {
      sort: { Sno: -1 },
    });

    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }

    // Check if the VideofolderName already exists
    const existingVideo = await AddvideoData.findOne({
      VideofolderName: req.body.VideofolderName,
    });

    if (!existingVideo) {
      const AddVideo = {
        Sno: newSno, // Use the newly calculated ID
        VideofolderName: req.body.VideofolderName,
      };

      const AddVideoDetails = await AddvideoData.create(AddVideo);

      console.log(AddVideoDetails);
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
    return res.json(allVideos);
  } catch (error) {
    console.error(error.message, "allAddVideosData");
    return res.status(500).json("Internal Server Error");
  }
});

app.put("/UpdateVideosDetails/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const video = await AddvideoData.findByIdAndUpdate(id, req.body);

    if (!video) {
      return res.status(404).json("Video Not Found");
    }

    return res.status(200).json("Video Folder updated successfully");
  } catch (error) {
    console.error(error.message, "UpdateVideosDetails");
    return res.status(500).json("Internal Server Error");
  }
});

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

app.delete("/deleteVideo/:id", middleware, async (req, res) => {
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

app.post("/AddVideoFilesData", middleware, async (req, res) => {
  try {
    // Find the last document with the lowest Sno (ascending order)
    const lastDocument = await videoFile.findOne({}, null, {
      sort: { Sno: -1 },
    });

    let newSno = 1; // Default ID if the collection is empty
    if (lastDocument) {
      newSno = lastDocument.Sno + 1; // Calculate the new ID
    }

    // Check if the VideofolderName already exists
    const existingVideo = await videoFile.findOne({
      Video1: req.body.Video1,
    });

    if (!existingVideo) {
      const AddVideo = {
        Sno: newSno,
        VideofolderName: req.body.VideofolderName,
        VideoTitleName: req.body.VideoTitleName,
        SourceName: req.body.SourceName,
        Video1: req.body.Video1,
      };

      const AddVideoDetails = await videoFile.create(AddVideo);

      console.log(AddVideoDetails);
      res.status(200).send("Video added successfully");
    } else {
      res.status(400).json("Video path with the same Link already exists");
    }
  } catch (e) {
    console.error(e.message, "AddVideoFilesData");
    return res.status(500).json(e.message);
  }
});

app.get("/DisplayAllVideos", async (req, res) => {
  try {
    const allVideos = await videoFile.find({});
    return res.json(allVideos);
  } catch (error) {
    console.error(error, message, "DisplayAllVideos");
    return res.status(500).json("Internal Server Error");
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
// Learn-Path
app.post("/addlearningpath", middleware, async (req, res) => {
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
    } = req.body;
    const isLearningPathExist = await allLearningPaths.findOne({
      learningPathTitle: learningPathTitle,
    });
    if (isLearningPathExist) {
      return res.send({ msg: "Path Already Registered", status: "failed" });
    }
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

app.put("/updatelearningpath/:learningPathId", middleware, async (req, res) => {
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
      authorName,
      hours,
      minutes,
      learningimg,
      fileName,
      requirements,
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
    existingLearningPath.authorName = authorName;
    existingLearningPath.hours = hours;
    existingLearningPath.minutes = minutes;
    existingLearningPath.learningimg = learningimg;
    existingLearningPath.fileName = fileName;
    existingLearningPath.requirements = requirements;

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

app.post("/addTopic/:learningPathId", middleware, async (req, res) => {
  try {
    const learningPathId = req.params.learningPathId;
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
    };

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

app.put(
  "/updateTopic/:learningPathId/:topicId",
  middleware,

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

//  Add Content Data

app.post(
  "/addContentOfTopicsinlearningpath/:learningPathId",
  middleware,
  async (req, res) => {
    try {
      const { _id, topicName, contentTitle, contentdes, contentimg, publish } =
        req.body;
      // const topicId = req.params.topicId;

      // Find the learning path by ID
      const learningPath = await allLearningPaths.findById(_id);

      if (!learningPath) {
        return res
          .status(404)
          .json({ msg: "Learning path not found", status: "failed" });
      }

      // Find the topic within the learning path by ID
      const topic = learningPath.topics.find(
        (t) => t.topicName.toString() === topicName
      );

      if (!topic) {
        return res
          .status(404)
          .json({ msg: "Topic not found", status: "failed" });
      }

      // Add the new content to the "content" array in the topic
      topic.content.push({
        _id: req.body._id,
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

//updatecontentintopicoflearningpath
app.put(
  "/updateContent/:learningPathId/:topicId/:contentId",
  middleware,

  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const contentId = req.params.contentId;
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

      // Find the index of the content item within the "content" array
      const contentIndex = topic.content.findIndex(
        (c) => c._id.toString() === contentId
      );

      if (contentIndex === -1) {
        return res
          .status(404)
          .json({ msg: "Content not found", status: "failed" });
      }

      // Update the properties of the existing content
      topic.content[contentIndex].contentTitle = contentTitle;
      topic.content[contentIndex].contentdes = contentdes;
      topic.content[contentIndex].contentimg = contentimg;
      topic.content[contentIndex].publish = publish;

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
      const learningPath = await LearningPath.findById(learningPathId);

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

      // siva
      // siva
    }
  }
);

app.delete("/onselectedLearningPath/:_id", middleware, async (req, res) => {
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
    console.error(error, "/onselectedLearningPath/:_id");
    return res.status(500).json("Internal Server Error");
  }
});

// //deleteTopicinLearningPath
app.delete(
  "/onselectedTopicinLearningPath/:learningPathId/:topicId",
  middleware,
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
      console.error(
        e.message,
        "/onselectedTopicinLearningPath/:learningPathId/:topicId"
      );
      return res
        .status(500)
        .json({ msg: "Internal Server Error", status: "failed" });
    }
  }
);

app.delete(
  "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentId",
  middleware,
  async (req, res) => {
    try {
      const learningPathId = req.params.learningPathId;
      const topicId = req.params.topicId;
      const contentId = req.params.contentId;

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
        (c) => c._id.toString() === contentId
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
      console.error(
        e.message,
        "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentId"
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
		res.status(201).json(savedCategory);
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

// Category



// Topic

app.post("/topic", async (req, res) => {
	try {
		const newCategory = new Topic(req.body);
		const savedCategory = await newCategory.save();
		res.status(201).json(savedCategory);
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

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});


app.use("/v1", require('./Routes/ChapterRoutes')) //api routes
app.use('/v1',  require('./Routes/MCQRoutes'));
app.use("/v2", require('./Routes/SubjectsRoutes')) 
app.use('/v2',paragMCQRouter)
app.use('/v4',require('./Routes/CodeingBasic'))
