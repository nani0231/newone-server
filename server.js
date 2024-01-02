const express = require("express");
const mongoose = require("mongoose");
const userData = require("./Model/userData");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware/jwtAuth");
const AddInstituteData = require("./Model/AddInstituteData");
const AddUsersData = require("./Model/StudentsData");
const AddUserByBatch = require("./Model/ByBatch");
const ByList = require("./Model/ByList");
const AddvideoData = require("./Model/LearnPath/Addvideo");
const videoFile = require("./Model/LearnPath/AddVideoFile");
const allLearningPaths = require("./Model/LearnPath/AlllearningPaths");
const paragMCQRouter = require('./Routes/ParagRoutes');

const AddVideoFile = require("./Model/LearnPath/AddVideoFile");
const app = express();
app.use(express.json());
app.use(cors());

// const bodyParser = require("body-parser");
const port = 4010;

const mogoURL =
  "mongodb+srv://badasiva22:Siva991276@cluster0.iis7lrd.mongodb.net/perfex-stack-project?retryWrites=true&w=majority";
  // "mongodb+srv://saiprakash2115:m1Yb7ZlsB0nVVGbY@cluster0.r19eo2o.mongodb.net/skillhub2?retryWrites=true&w=majority"
  
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

app.post("/AddVideoPath",middleware , async (req, res) => {
  try {
    // Check if the VideofolderName already exists
    const existingVideo = await AddvideoData.findOne({  
      VideofolderName: req.body.VideofolderName,
    });

    if (!existingVideo) {
      const AddVideo = new AddvideoData(req.body)
    
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

app.get("/allAddVideosData",middleware , async (req, res) => {
  try {
    const allVideos = await AddvideoData.find({});
    return res.json(allVideos);
  } catch (error) {
    console.error(error.message, "allAddVideosData");
    return res.status(500).json("Internal Server Error");
  }
});

app.put("/UpdateVideosDetails/:selectedvideopathId",middleware , async (req, res) => {
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

app.delete("/deleteVideo/:id",middleware , async (req, res) => {
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
app.post("/AddVideoFilesData/:videopathId",middleware , async (req, res) => {
  try {
    const videopathId = req.params.videopathId
    const {VideofolderName,VideoTitleName,SourceName,Video1} = req.body

    const existingVideo = await AddvideoData.findById(videopathId);

    if (!existingVideo) {
      return res.status(404).json({ msg: 'VideoPath not found', status: 'failed' });
    }
    const isVideoTitleName = existingVideo.videoFile.some(
      (each) => each.VideoTitleName === VideoTitleName
    );
    if (isVideoTitleName) {
      return res.status(400).json({
        msg: 'VideoTitle with the same name already exists',
        status: 'failed',
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

    return res.json({ msg: 'VideoFile added successfully', status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});
//delete videofiles
app.delete("/deleteVideofiles/:videopathId/:videofileId",middleware , async (req, res) => {
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
    return res.json({ msg: 'VideoFile deleted successfully', status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
  }
});
   

   
//get videofiles with videopathid
app.get("/DisplayAllVideos/:videopathId",middleware , async (req, res) => {
  try {
    const videopathId = req.params.videopathId;
    const existingVideoPath = await AddvideoData.findById(videopathId);
    if (!existingVideoPath) {
      return res.status(404).json({ msg: 'VideoPath not found', status: 'failed' });
    }

    const allVideos = existingVideoPath
    return res.json({allVideos,status :'success'});
  } catch (error) {
    console.error(error.message, "DisplayAllVideos");
    return res.status(500).json({msg:"Internal Server Error",status: 'failed'});
  }
});
//get allvideofiles
app.get("/getAllVideoFiles", async (req, res) => {
  try {
    // Retrieve all documents in the AddvideoData collection
    const allVideos = await AddvideoData.find();

    // Extract and combine all videoFile arrays from the documents
    const allVideoFiles = allVideos.reduce((acc, video) => acc.concat(video.videoFile), []);

    return res.json({ videoFiles: allVideoFiles, status: 'success' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
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
app.put("/UpdateVideofileDetails/:selectedvideopathId/:selectedVideofileId",middleware , async (req, res) => {
  try {
    const selectedvideopathId = req.params.selectedvideopathId;
      const selectedVideofileId = req.params.selectedVideofileId;
      const VideoTitleName= req.body.VideoTitle;
      const Video1= req.body.videofile;
      
      const existingVideofile = await AddvideoData.findById(selectedvideopathId);
    
      if (!existingVideofile) {
        return res.status(404).json({ msg: 'Videopath not found', status: 'failed' });
      }
      const videofileToUpdate = existingVideofile.videoFile.id(selectedVideofileId);

      if (!videofileToUpdate) {
        return res.status(404).json({ msg: 'Videofile not found', status: 'failed' });
      }

      videofileToUpdate.VideoTitleName = VideoTitleName;
      videofileToUpdate.Video1 = Video1;
      
      await existingVideofile.save();
      return res.json({ msg: 'Videofile updated successfully', status: 'success', updatedVideofile: videofileToUpdate });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ msg: 'Internal Server Error', status: 'failed' });
    }
  });
    
// Learn-Path
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

//  Add Content Data

//

// app.post(
//   "/addContentOfTopicsinlearningpath/:learningPathId",
//   async (req, res) => {
//     try {
//       const {
//         _id,
//         topicName,
//         contentTitle,
//         contentdes,
//         contentimg,
//         publish,
//         contentTime,
//       } = req.body;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(_id);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by name
//       const topic = learningPath.topics.find(
//         (t) => t.topicName.toString() === topicName
//       );

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Check if contentTitle already exists in the topic
//       const existingContent = topic.content.find(
//         (c) => c.contentTitle === contentTitle
//       );

//       if (existingContent) {
//         return res.status(400).json({
//           msg: "Content with the same title already exists",
//           status: "failed",
//         });
//       }

//       // Add the new content to the "content" array in the topic
//       topic.content.push({
//         _id: req.body._id,
//         contentTitle,
//         contentdes,
//         contentimg,
//         publish,
//         contentTime: new Data(),
//       });
//       console.log(contentTime);

//       // Save the updated learning path document
//       await learningPath.save();

//       return res
//         .status(200)
//         .json({ msg: "Content added successfully", status: "success" });
//     } catch (e) {
//       console.error(e.message, "addContentOfTopicsinlearningpath");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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

// app.get(
//   "/getAllContents/:learningPathId/:topicId/:contentId",
//   async (req, res) => {
//     try {
//       const { learningPathId, topicId, contentId } = req.params;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(learningPathId);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = learningPath.topics.id(topicId);

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Find the content within the topic by ID
//       const content = topic.content.id(contentId);

//       if (!content) {
//         return res
//           .status(404)
//           .json({ msg: "Content not found", status: "failed" });
//       }

//       // Retrieve all contents data for the given learning path, topic, and content
//       const allContentsData = topic.content.map((contentItem) => {
//         // Modify the content data as needed
//         return {
//           id: contentItem.id,
//           topicContentname: contentItem.topicContentname,
//           contentTitle: contentItem.contentTitle,
//           contentdes: contentItem.contentdes,
//           contentimg: contentItem.contentimg,
//           publish: contentItem.publish,
//           // Add more properties as needed
//         };
//       });

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

// app.get(
//   "/getAllContents/:learningPathId/:topicId/:topicContentname",
//   async (req, res) => {
//     try {
//       const { learningPathId, topicId, topicContentname } = req.params;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(learningPathId);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = learningPath.topics.id(topicId);

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Filter contents based on the provided topicContentname
//       const matchingContents = topic.content.filter(
//         (contentItem) => contentItem.topicContentname === topicContentname
//       );

//       if (matchingContents.length === 0) {
//         return res
//           .status(404)
//           .json({ msg: "Content not found", status: "failed" });
//       }

//       // Return the details of all matching contents
//       const allContentsData = matchingContents.map((content) => ({
//         id: content.id,
//         topicContentname: content.topicContentname,
//         contentTitle: content.contentTitle,
//         contentdes: content.contentdes,
//         contentimg: content.contentimg,
//         publish: content.publish,
//         // Add more properties as needed
//       }));

//       // Return the content details
//       return res
//         .status(200)
//         .json({ contents: allContentsData, status: "success" });
//     } catch (e) {
//       console.error(e.message, "get all contents data");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

//       // Return the modified content data
//       return res
//         .status(200)
//         .json({ contents: allContentsData, status: "success" });
//     } catch (e) {
//       console.error(e.message, "get all contents");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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
// app.put(
//   "/updateContent/:learningPathId/:topicId/:contentId",

//   async (req, res) => {
//     try {
//       const learningPathId = req.params.learningPathId;
//       const topicId = req.params.topicId;
//       const contentId = req.params.contentId;
//       const { contentTitle, contentdes, contentimg, publish } = req.body;

//       // Find the existing learning path by ID
//       const existingLearningPath = await allLearningPaths.findById(
//         learningPathId
//       );

//       if (!existingLearningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = existingLearningPath.topics.find(
//         (t) => t._id.toString() === topicId
//       );

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Find the index of the content item within the "content" array
//       const contentIndex = topic.content.findIndex(
//         (c) => c._id.toString() === contentId
//       );

//       if (contentIndex === -1) {
//         return res
//           .status(404)
//           .json({ msg: "Content not found", status: "failed" });
//       }

//       // Update the properties of the existing content
//       topic.content[contentIndex].contentTitle = contentTitle;
//       topic.content[contentIndex].contentdes = contentdes;
//       topic.content[contentIndex].contentimg = contentimg;
//       topic.content[contentIndex].publish = publish;

//       // Save the updated learning path document
//       await existingLearningPath.save();

//       return res.json({
//         msg: "Content updated successfully",
//         status: "success",
//       });
//     } catch (e) {
//       console.error(e.message, "updateContent");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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

      // siva
      // siva
    }
  }
);

// app.get(
//   "/getSinglecontentData/:learningPathId/:topicId/:contentTitle",
//   async (req, res) => {
//     try {
//       const { learningPathId, topicId, contentTitle } = req.params;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(learningPathId);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = learningPath.topics.find(
//         (t) => t._id.toString() === topicId
//       );

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Return all content items in the specified topic
//       return res.status(200).json(topic.content);
//     } catch (e) {
//       console.error(e.message, "get content");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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

// app.get(
//   "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentId",middleware,
//   async (req, res) => {
//     try {
//       const { learningPathId, topicId,contentId } = req.params;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(learningPathId);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = learningPath.topics.id(topicId)

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }
//       const content = topic.content.id(contentId);

//       if (!content) {
//         return res.status(404).json({ msg: 'content not found', status: 'failed' });
//       }
//       // Return all content items in the specified topic
//       return res.status(200).json({Content, status: 'success'});
//     } catch (e) {
//       console.error(e.message, "get content");
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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
    console.error(error, "/onselectedLearningPath/:_id");
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

// app.delete(
//   "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentId",

//   async (req, res) => {
//     try {
//       const learningPathId = req.params.learningPathId;
//       const topicId = req.params.topicId;
//       const contentId = req.params.contentId;

//       // Find the learning path by ID
//       const learningPath = await allLearningPaths.findById(learningPathId);

//       if (!learningPath) {
//         return res
//           .status(404)
//           .json({ msg: "Learning path not found", status: "failed" });
//       }

//       // Find the topic within the learning path by ID
//       const topic = learningPath.topics.find(
//         (t) => t._id.toString() === topicId
//       );

//       if (!topic) {
//         return res
//           .status(404)
//           .json({ msg: "Topic not found", status: "failed" });
//       }

//       // Find the index of the content item within the "content" array
//       const contentIndex = topic.content.findIndex(
//         (c) => c._id.toString() === contentId
//       );

//       if (contentIndex === -1) {
//         return res
//           .status(404)
//           .json({ msg: "Content not found", status: "failed" });
//       }

//       // Remove the content item from the "content" array
//       topic.content.splice(contentIndex, 1);

//       // Save the updated learning path document
//       await learningPath.save();

//       return res
//         .status(200)
//         .json({ msg: "Content deleted successfully", status: "success" });
//     } catch (e) {
//       console.error(
//         e.message,
//         "/onselectedContentinTopicinLearningPath/:learningPathId/:topicId/:contentId"
//       );
//       return res
//         .status(500)
//         .json({ msg: "Internal Server Error", status: "failed" });
//     }
//   }
// );

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
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

app.use("/v1", require('./Routes/ChapterRoutes')) //api routes
app.use('/v1',  require('./Routes/MCQRoutes'));
app.use("/v2", require('./Routes/SubjectsRoutes')) 
app.use('/v2',paragMCQRouter)
app.use('/v4',require('./Routes/CodeingBasic'))
