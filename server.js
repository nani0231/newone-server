const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Subject =require('./Model/Subject')
const userData = require("./Model/userData");
const jwt = require("jsonwebtoken");
const middleware = require("./Middlware");
const AddInstituteData = require("./Model/AddInstituteData");
const AddUsersData = require("./Model/StudentsData");
const AddUserByBatch = require("./Model/ByBatch");
const ByList = require("./Model/ByList");
const AddvideoData = require("./Model/LearnPath/Addvideo");
const videoFile = require("./Model/LearnPath/AddVideoFile");
const paragMCQRouter = require('./Routes/ParagRoutes');
// const bodyParser = require("body-parser");

const app = express();
const port = 4010;

const mogoURL =
  "mongodb+srv://badasiva22:Siva991276@cluster0.iis7lrd.mongodb.net/perfex-stack-project?retryWrites=true&w=majority";

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
  res.send("Welcome to developer hubs server");
});

app.post("/UserRegister", async (req, res) => {
  console.log(req.body);

  try {
    const user = await userData.findOne({ UserEmail: req.body.UserEmail }); // mongo db condition
    // console.log(user)
    if (!user) {
      // or if(user === undefined)
      // user not found excutes below code
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
    console.log(e.message);
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
    console.error(error);
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

//update

app.put("/UpdateInstitute/:id", async (req, res) => {
  const { id } = req.params;
  const user = await AddInstituteData.findByIdAndUpdate(id, req.body);

  if (!user) {
    res.status(400).json("User Not Found");
  }
  res.status(200).json("users data updated successfully");
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

// app.delete("/deleteInstitute/:id", async (req, res) => {
//   try {
//     const id = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json("Invalid ID");
//     }

//     const deletedInstitute = await AddInstituteData.findByIdAndRemove(id);

//     if (deletedInstitute) {
//       return res.status(200).json("Institute deleted successfully");
//     } else {
//       return res.status(404).json("Institute not found");
//     }
//   } catch (e) {
//     console.error(e.message);
//     return res.status(500).json(e.message);
//   }
// });

// app.put("/update",async(req, res) => {
//   console.log(req.body);

//   const { id , ...rest} = req.body;
//   console.log(rest);
//   await AddInstituteData.updateOne({_id : req.body.id}, rest)
//   res.send({success : true, message : "update success"})
// })
//siva
//siva
//siva
//siva
//siva
//siva
//siva

app.get("/allAddInstitutes", async (req, res) => {
  const allInstitutes = await AddInstituteData.find({});

  return res.json(allInstitutes);
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
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/individualInstituteNames/:InstituteName", async (req, res) => {
  const { InstituteName } = req.params;
  const individualInstitute = await AddInstituteData.findOne({
    InstituteName: InstituteName,
  });
  if (!individualInstitute) {
    return res.send("User not Found!!!");
  }
  return res.send(individualInstitute);
});

//Add Users
app.post("/AddUsers", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

//login Data
// app.post("/UserDetailslogin", async (req, res) => {
//   const { userEmail, Password } = req.body;
//   try {
//     const user = await AddUsersData.findOne({ userEmail });
//     if (!user) {
//       return res.status(401).json({ message: "Email not found" });
//     }
//     if (Password !== user.Password) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }
//     const payload = {
//       user: user.id,
//     };
//     jwt.sign(payload, "jwtpassword", { expiresIn: 36000000 }, (err, token) => {
//       if (err) {
//         throw err;
//       }

//       res.json({ token });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "An error occurred on the server. Please try again later.",
//     });
//   }
// });
app.post("/UserDetailslogin", async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      message: "An error occurred on the server. Please try again later.",
    });
  }
});
//siva

app.get("/allUsersData", async (req, res) => {
  const allInstitutes = await AddUsersData.find({});

  return res.json(allInstitutes);
});

//Siva
app.get("/individualUser/:id", async (req, res) => {
  const { id } = req.params;
  const individualInstitute = await AddUsersData.findById({ _id: id });
  if (!individualInstitute) {
    return res.send("User not Found!!!");
  }
  return res.send(individualInstitute);
});

app.post("/ByBatchData", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.post("/ByListData", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.put("/ByBatchData/:InstituteType", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.put("/ByListData/:InstituteType", async (req, res) => {
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
    console.error(e.message);
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

//Learn Path Data

app.post("/AddVideoPath", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});
app.get("/allAddVideosData", async (req, res) => {
  const allVideos = await AddvideoData.find({});

  return res.json(allVideos);
});

app.put("/UpdateVideosDetails/:id", async (req, res) => {
  const { id } = req.params;
  const video = await AddvideoData.findByIdAndUpdate(id, req.body);

  if (!video) {
    res.status(400).json("Video Not Found");
  }
  res.status(200).json("Video Folder updated successfully");
});

app.get("/DisplayIndividualVideo/:id", async (req, res) => {
  const { id } = req.params;
  const DisplayIndividualVideo = await AddvideoData.findById({ _id: id });
  if (!DisplayIndividualVideo) {
    return res.send("Video not Found!!!");
  }
  return res.send(DisplayIndividualVideo);
});

app.delete("/deleteVideo/:id", async (req, res) => {
  try {
    const id = req.params.id; // Use req.params.id to get the instituteId
    const deletedVideo = await AddvideoData.findByIdAndRemove(id);

    if (deletedVideo) {
      return res.status(200).json("Video Folder deleted successfully");
    } else {
      return res.status(404).json("Video Folder not found");
    }
  } catch (e) {
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.post("/AddVideoFilesData", async (req, res) => {
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.get("/DisplayAllVideos", async (req, res) => {
  const allVideos = await videoFile.find({});

  return res.json(allVideos);
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
    console.error(e.message);
    return res.status(500).json(e.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
//kumar
app.use("/v1", require('./Routes/ChapterRoutes')) //api routes
app.use('/v1',  require('./Routes/MCQRoutes'));
app.use("/v1", require('./Routes/SubjectsRoutes')) 
app.use('/v2',paragMCQRouter)
app.use('/v4',require('./Routes/CodeingBasic'))
//app.use("/v2", require('./Routes/SubjectsRoutes')) //api routes
//app.use('/v1',  require('./Routes/MCQRoutes'));
// app.use('v3', require("./Routes/ChapterRoutes"))

//kumar
