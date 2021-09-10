require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const path = require("path");

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Table of Contents
//CreateConnection
//Home
//Token
//Login, Logout, Register API pet Owners
//Get, Delete, Update Pet Owner
//Get, Delete, Update Pets
//Get Verified & Pending, Add, Delete, Update, Approved Vet Clinic
//Get, Add, Delete, and Update Products
//Get, Add, Delete, and Update Services
//Get, Add, Delete, and Update Pharmacy
//Get and Add History
//Get, Add, Delete, and Update Posts
//dashboard get data system admin
//dashboard get data vet clinic admin
//Appointment Get, Add, Delete, Update
//Talk to Vet
//Authenticate Token
//GenerateAccessToken

//--------------------------------------------------------------------------//
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "	id16572533_terravetmobile",
//   password: "W_Bs#S-XGsaq6G<",
//   database: "id16572533_terravet",
//   localAddress:""
// });

const db = mysql.createConnection({
  host: "terravet.mysql.database.azure.com",
  user: "terravet@terravet",
  password: "llanetaJC05",
  database: "terravet",
});

// console.log(db);

//--------------------------------------------------------------------------//
app.get("/home", authenticateToken, (req, res) => {
  res.send(req.user);
});

app.get("/api/test", (req, res) => {
  db.query("SELECT * FROM user_role", (err, result) => {
    res.send(result);
  })

});

//--------------------------------------------------------------------------//
let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});
//--------------------------------------------------------------------------//

//login API
app.get("/api/login", (req, res) => {
  //Authenticate
  console.log("here");
  const email = req.query.email;
  const password = req.query.password;
  console.log(email + " " + password);
  let role;
  db.query("SELECT * FROM user_role WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      role = result[0].userrole;
      if (result[0].userrole == 1) {
        db.query(
          "SELECT * FROM pet_owners WHERE email = ?",
          email,
          (err, result) => {
            if (err) {
              res.send({ err: err });
            }

            if (result.length > 0) {
              bcrypt.compare(
                password,
                result[0].password,
                (error, response) => {
                  if (response) {
                    const user = { result };
                    // console.log(user)
                    const accessToken = generateAccessToken(user);
                    const refreshToken = jwt.sign(
                      user,
                      process.env.REFRESH_TOKEN_SECRET
                    );
                    refreshTokens.push(refreshToken);
                    let u = JSON.parse(JSON.stringify(user));
                    // console.log(u.result[0].name)
                    res.send({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                      message: "Correct",
                      role: 1,
                      user: JSON.parse(JSON.stringify(result[0])),
                    });
                  } else {
                    res.send({ message: "Wrong password!" });
                  }
                }
              );
            } else {
              res.send({ message: "User doesn't exist..." });
            }
          }
        );
      } else if (result[0].userrole == 2) {
        db.query(
          "SELECT * FROM vet_clinic WHERE email = ?",
          email,
          (err, result) => {
            if (err) {
              res.send({ err: err });
            }

            if (result.length > 0) {
              bcrypt.compare(
                password,
                result[0].password,
                (error, response) => {
                  if (response) {
                    const user = { result };
                    // console.log(user)
                    const accessToken = generateAccessToken(user);
                    const refreshToken = jwt.sign(
                      user,
                      process.env.REFRESH_TOKEN_SECRET
                    );
                    refreshTokens.push(refreshToken);
                    let u = JSON.parse(JSON.stringify(user));
                    // console.log(u.result[0].name)
                    res.send({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                      message: "Correct",
                      role: 2,
                      vetStatus: result[0].vet_status,
                      id: result[0].vet_admin_id,
                    });
                  } else {
                    res.send({ message: "Wrong password!" });
                  }
                }
              );
            } else {
              res.send({ message: "User doesn't exist..." });
            }
          }
        );
      } else if (result[0].userrole == 3) {
        db.query(
          "SELECT * FROM system_administrator WHERE email = ?",
          email,
          (err, result) => {
            if (err) {
              res.send({ err: err });
            }

            if (result.length > 0) {
              bcrypt.compare(
                password,
                result[0].password,
                (error, response) => {
                  if (response) {
                    const user = { result };
                    // console.log(user)
                    const accessToken = generateAccessToken(user);
                    const refreshToken = jwt.sign(
                      user,
                      process.env.REFRESH_TOKEN_SECRET
                    );
                    refreshTokens.push(refreshToken);
                    let u = JSON.parse(JSON.stringify(user));
                    console.log(result[0]);
                    res.send({
                      accessToken: accessToken,
                      refreshToken: refreshToken,
                      message: "Correct",
                      role: 3,
                      user: JSON.parse(JSON.stringify(result[0])),
                    });
                  } else {
                    res.send({ message: "Wrong password!" });
                  }
                }
              );
            } else {
              res.send({ message: "User doesn't exist..." });
            }
          }
        );
      }
    } else {
      res.send({ message: "User doesn't exist..." });
    }
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/register/petowner", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const address = req.body.address;
  const contactNumber = req.body.contactNumber;
  const profile_petowner = req.body.profile_petowner;
  // const imageUrl = req.body.profile_petowner;
  console.log(name);

  // console.log(uploadpetowner.single(profile_petowner));
  //   const imageUrl = `http://localhost:3001/profile/petowner/${req.file.filename}`;

  db.query(
    "INSERT INTO user_role (email,userrole) VALUES (?,?)",
    [email, 1],
    (err, result) => {
      console.log("no error registering");
    }
  );

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO pet_owners (email,password,name,address,contact_number,profilePicture) VALUES (?,?,?,?,?,?)",
      [email, hash, name, address, contactNumber, profile_petowner],
      (err, result) => {
        console.log(err);
        res.send({
          message: "Registered",
        });
      }
    );
  });
});

//this api is for petowner
//get petowner data
app.get("/petowner", (req, res) => {
  const sqlQuery = "SELECT * FROM pet_owners";
  db.query(sqlQuery, (err, result) => {
    // console.log(err);
    res.send(result);
  });
});

//get specific petowner data
app.get("/vetclinic/petowner/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id);
  const sqlQuery = "SELECT name FROM pet_owners WHERE pet_owner_id = ?";
  db.query(sqlQuery, pet_owner_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.delete("/petowner/delete/:petowner_id", (req, res) => {
  const petowner_id = req.params.petowner_id;

  const sqlQuery = "DELETE FROM pet_owners WHERE pet_owner_id = ?";
  db.query(sqlQuery, petowner_id, (err, result) => {
    console.log(result);
  });
});

app.put("/petowner/update/:petowner_id", (req, res) => {
  const petowner_id = req.params.petowner_id;
  const updatePetOwnerName = req.body.updatePetOwnerName;
  const updatePetOwnerEmail = req.body.updatePetOwnerEmail;
  const updatePetOwnerAddress = req.body.updatePetOwnerAddress;
  const updatePetOwnerContactNumber = req.body.updatePetOwnerContactNumber;

  const sqlQuery =
    "UPDATE pet_owners SET name = ?,email = ?,address = ?,contact_number = ?  WHERE pet_owner_id = ?";
  db.query(
    sqlQuery,
    [
      updatePetOwnerName,
      updatePetOwnerEmail,
      updatePetOwnerAddress,
      updatePetOwnerContactNumber,
      petowner_id,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/api/login/mobile", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email + " " + password);

  db.query("SELECT * FROM user_role WHERE email = ?", email, (err, result) => {
    if (result.length > 0) {
      db.query(
        "SELECT * FROM pet_owners WHERE email = ?",
        email,
        (err, result) => {
          if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
              if (response) {
                console.log(result);
                res.send({ message: "Correct", user: result });
              }
            });
          } else {
            res.send({ message: "Incorrect Password" });
          }
        }
      );
    } else {
      res.send({ message: "Incorrect Email/Password combination" });
    }
  });
});

app.post("/api/signup/mobile", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const address = req.body.address;
  const contact_number = req.body.contactNumber;
  const profilePicture = req.body.profilePicture;

  console.log(email + " " + password);

  db.query(
    "INSERT INTO user_role (email,userrole) VALUES (?,?)",
    [email, 1],
    (err, result) => {
      console.log("no error registering");
    }
  );

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO pet_owners (email,password,name,address,contact_number,profilePicture) VALUES (?,?,?,?,?,?)",
      [email, hash, name, address, contact_number, profilePicture],
      (err, result) => {
        console.log(err);
        res.send({
          message: "Registered",
        });
      }
    );
  });
});

// get Emails validation
app.get("/users", (req, res) => {
  const sqlQuery = "SELECT email FROM user_role";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//--------------------------------------------------------------------------//

//this api is for pets

app.get("/pets", (req, res) => {
  const sqlQuery = "SELECT * FROM pets";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pets/information/:petid", (req, res) => {
  const pet_id = req.params.petid;
  // console.log(pet_id);
  const sqlQuery = "SELECT * FROM pets WHERE pet_id = ?";
  db.query(sqlQuery, pet_id.substring(1), (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pets/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id);
  const sqlQuery = "SELECT * FROM pets WHERE pet_owner_id = ?";
  db.query(sqlQuery, pet_owner_id.substring(1), (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pets/records/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  // console.log(vet_admin_id);
  const sqlQuery =
    "SELECT * FROM pet_registry_for_vet JOIN pets ON pet_registry_for_vet.pet_id = pets.pet_id WHERE pet_registry_for_vet.vet_admin_id = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pets/appointment/submit/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id);
  const sqlQuery = "SELECT * FROM pets WHERE pet_owner_id = ?";
  db.query(sqlQuery, pet_owner_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pets/appointment/defaultpet/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id);
  const sqlQuery = "SELECT * FROM pets WHERE pet_owner_id = ?";
  db.query(sqlQuery, pet_owner_id, (err, result) => {
    // console.log(result);
    res.send(result[0]);
  });
});

app.get("/pets/appointment/:pet_id", (req, res) => {
  const pet_id = req.params.pet_id;
  // console.log(pet_id);
  const sqlQuery = "SELECT * FROM pets WHERE pet_id = ?";
  db.query(sqlQuery, pet_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.post("/pets/insert", (req, res) => {
  const ownerId = req.body.petOwnerId;
  const ownerName = req.body.petOwnerName;
  const petname = req.body.petname;
  const typeOfPet = req.body.typeOfPet;
  const breedOfPet = req.body.breedOfPet;
  const genderOfPet = req.body.genderOfPet;
  const birthDate = req.body.birthDate;
  const imageUrl = req.body.imageUrl;

  const sqlQuery =
    "INSERT INTO pets (pet_owner_id,pet_owner_name,pet_name,type_of_pet,breed_of_pet,gender,birth_day,pet_picture) VALUES (?,?,?,?,?,?,?,?)";
  db.query(
    sqlQuery,
    [
      ownerId,
      ownerName,
      petname,
      typeOfPet,
      breedOfPet,
      genderOfPet,
      birthDate,
      imageUrl,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.delete("/pets/delete/:pet_id", (req, res) => {
  const pet_id = req.params.pet_id;

  const sqlQuery = "DELETE FROM pets WHERE pet_id = ?";
  db.query(sqlQuery, pet_id, (err, result) => {
    console.log(result);
    if (err !== null) {
      res.sendStatus(200).send("Ok");
    } else {
      console.log(err);
    }
  });
});

app.put("/pets/update/:pet_id", (req, res) => {
  const pet_id = req.params.pet_id;
  const petName = req.body.pet_name;
  const typeOfPet = req.body.type_of_pet;
  const breedOfPet = req.body.breed_of_pet;
  const gender = req.body.gender;
  const birthDay = req.body.birth_day;

  const sqlQuery =
    "UPDATE pets SET pet_name = ?,type_of_pet = ?,breed_of_pet = ?,gender = ?,birth_day = ?  WHERE pet_id = ?";
  db.query(
    sqlQuery,
    [petName, typeOfPet, breedOfPet, gender, birthDay, pet_id],
    (err, result) => {
      if (err != null) {
        res.sendStatus(200).send("Ok");
      }
    }
  );
});

app.get("/pets/length/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  const sqlQuery = "SELECT * FROM appointment WHERE vet_admin_id = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(result.length);
    console.log(vet_admin_id.substring(1));
    console.log(result);
    res.send({
      pets: result.length,
    });
  });
});

//API pet vaccine insertion
app.post("/pets/vaccination/record/:pet_id", (req, res) => {
  const pet_id = req.params.pet_id;
  const appointment_id = req.body.appointment_id;
  const vaccineName = req.body.vaccineName;
  const againts = req.body.againts;
  const manufacturer = req.body.manufacturer;
  const vaccineNumber = req.body.vaccineNumber;

  const sqlQuery =
    "INSERT INTO immunization_history (pet_id,vaccine_name,againts,vaccine_number,manufacturer,appointment_id) VALUES (?,?,?,?,?,?)";
  db.query(
    sqlQuery,
    [pet_id, vaccineName, againts, vaccineNumber, manufacturer, appointment_id],
    (err, result) => {
      res.send({
        response: "success",
      });
    }
  );
});

//--------------------------------------------------------------------------//

//this api is for vet clinic
//api for verified vet clinic
app.get("/vetclinic/verified", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic WHERE vet_status = 'Verified'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for pending vet clinic
app.get("/vetclinic/pending", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic WHERE vet_status = 'Pending'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for resubmit vet clinic
app.get("/vetclinic/resubmit", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic WHERE vet_status = 'Invalid'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for resubmit vet clinic
app.get("/vetclinic/unverified", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic WHERE vet_status = 'Unverified'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for finding vet clinic
app.get("/vetclinic/verified/:vetid", (req, res) => {
  const vet_admin_id = req.params.vetid;
  // console.log(vet_admin_id);
  const sqlQuery =
    "SELECT * FROM vet_clinic WHERE vet_status = 'Verified' AND vetid = ?";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for finding vet clinic in appointment
app.get("/vetclinic/verified/appointment/:vetid", (req, res) => {
  const vet_admin_id = req.params.vetid;
  // console.log(vet_admin_id);
  const sqlQuery =
    "SELECT * FROM vet_clinic WHERE vet_status = 'Verified' AND vetid = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.post("/vetclinic/insert", (req, res) => {
  console.log("here");
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const address = req.body.address;
  const contactNumber = req.body.contactNumber;
  const vetPicture = req.body.vetPicture;
  const enableProduct = req.body.enableProduct;
  const enablePharmacy = req.body.enablePharmacy;
  const enableService = req.body.enableService;
  const enableConsultation = req.body.enableConsultation;
  const enableExamination = req.body.enableExamination;
  const enableGrooming = req.body.enableGrooming;
  const enableVaccination = req.body.enableVaccination;
  const enablePreventiveControls = req.body.enablePreventiveControls;
  const enableInHouseLab = req.body.enableInHouseLab;

  console.log(email);
  bcrypt.hash(password, saltRounds, (err, hash) => {
    bcrypt.hash(name, saltRounds, (err, hashId) => {
      const sqlQuery =
        "INSERT INTO vet_clinic (email,password,vet_name,vet_address,vet_contact_number,vet_picture,vet_status,enableProduct,enablePharmacy,enableServices,enableConsultation,enableExamination,enableGrooming,enableVaccination,enablePreventiveControls,enableInHouseLab,vetid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      db.query(
        sqlQuery,
        [
          email,
          hash,
          name,
          address,
          contactNumber,
          vetPicture,
          "Unverified",
          enableProduct,
          enablePharmacy,
          enableService,
          enableConsultation,
          enableExamination,
          enableGrooming,
          enableVaccination,
          enablePreventiveControls,
          enableInHouseLab,
          hashId,
        ],
        (err, result) => {
          if (err !== null) {
            console.log(err);
          } else {
            db.query(
              "INSERT INTO user_role (email,userrole) VALUES (?,?)",
              [email, 2],
              (err, result) => {
                console.log("no error registering");
                res.send({
                  message: "Registered",
                });
              }
            );
          }
        }
      );
    });
  });
});

app.put("/vetclinic/verification/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  const vet_permit = req.body.vet_permit;
  console.log(vet_permit);
  const sqlQuery =
    "UPDATE vet_clinic SET vet_permit = ? , vet_status = ? WHERE vet_admin_id = ?";
  db.query(sqlQuery, [vet_permit, "Pending", vet_admin_id], (err, result) => {
    console.log(result);
    res.send({
      message: "Update Successfully",
    });
  });
});

app.delete("/vetclinic/delete/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "DELETE FROM vet_clinic WHERE vet_admin_id = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    console.log(result);
  });
});

//api of vet clinic if they need to update their vet clinic info
app.put("/vetclinic/update/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  const email = req.body.email;
  const vet_name = req.body.vet_name;
  const vet_address = req.body.vet_address;
  const vet_contact_number = req.body.vet_contact_number;
  const scheduleMonday = req.body.scheduleMonday;
  const scheduleTuesday = req.body.scheduleTuesday;
  const scheduleWednesday = req.body.scheduleWednesday;
  const scheduleThursday = req.body.scheduleThursday;
  const scheduleFriday = req.body.scheduleFriday;
  const scheduleSaturday = req.body.scheduleSaturday;
  const scheduleSunday = req.body.scheduleSunday;
  // console.log(scheduleMonday);
  const sqlQuery = `UPDATE vet_clinic SET email = ?, vet_name = ? ,vet_address = ?,vet_contact_number = ?,
    scheduleMonday = ? , scheduleTuesday = ?, scheduleWednesday = ? , scheduleThursday = ?,
    scheduleFriday = ? , scheduleSaturday = ? ,scheduleSunday = ?
    WHERE	vet_admin_id = ?`;
  db.query(
    sqlQuery,
    [
      email,
      vet_name,
      vet_address,
      vet_contact_number,
      scheduleMonday,
      scheduleTuesday,
      scheduleWednesday,
      scheduleThursday,
      scheduleFriday,
      scheduleSaturday,
      scheduleSunday,
      vet_admin_id,
    ],
    (err, result) => {
      if (err === null) {
        res.sendStatus(200);
      } else {
        console.log(err);
        // res.sendStatus(400).send('Bad');
      }
    }
  );
});

//api of system admin if they need to approved a vet clinic
app.put("/vetclinic/confirm/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "UPDATE vet_clinic SET vet_status = ? WHERE	vet_admin_id = ?";
  db.query(sqlQuery, ["Verified", vet_admin_id], (err, result) => {
    console.log(err);
  });
});

//api of system admin if they need to reject a vet clinic
app.put("/vetclinic/invalid/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "UPDATE vet_clinic SET vet_status = ? WHERE	vet_admin_id = ?";
  db.query(sqlQuery, ["Invalid", vet_admin_id], (err, result) => {
    console.log(err);
  });
});

//api of system admin if they need to delete a vet clinic
app.delete("/vetclinic/remove/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "DELETE FROM vet_clinic WHERE vet_admin_id = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(err);
    if (err === null) {
      res.sendStatus(200);
    } else {
      console.log(err);
    }
  });
});

//authenticate Vet upon uploading permit
app.get("/vet/uploads", (req, res) => {
  //Authenticate
  // console.log("here");
  const email = req.query.email;

  db.query("SELECT * FROM user_role WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result[0].userrole == 2) {
      db.query(
        "SELECT * FROM vet_clinic WHERE email = ?",
        email,
        (err, result) => {
          if (err) {
            res.send({ err: err });
          }
          const user = { result };
          // console.log(user)
          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
          refreshTokens.push(refreshToken);
          let u = JSON.parse(JSON.stringify(user));
          // console.log(u.result[0].name)
          res.send({
            accessToken: accessToken,
            refreshToken: refreshToken,
            message: "Correct",
            role: 2,
            vetStatus: result[0].vet_status,
            id: result[0].vet_admin_id,
          });
        }
      );
    }
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/register/petowner", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const address = req.body.address;
  const contactNumber = req.body.contactNumber;
  const profile_petowner = req.body.profile_petowner;
  // const imageUrl = req.body.profile_petowner;
  console.log(name);

  // console.log(uploadpetowner.single(profile_petowner));
  //   const imageUrl = `http://localhost:3001/profile/petowner/${req.file.filename}`;

  db.query(
    "INSERT INTO user_role (email,userrole) VALUES (?,?)",
    [email, 1],
    (err, result) => {
      console.log("no error registering");
    }
  );

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO pet_owners (email,password,name,address,contact_number,profilePicture) VALUES (?,?,?,?,?,?)",
      [email, hash, name, address, contactNumber, profile_petowner],
      (err, result) => {
        console.log(err);
        res.send({
          message: "Registered",
        });
      }
    );
  });
});

//--------------------------------------------------------------------------//

//this api is for products

app.get("/product", (req, res) => {
  const sqlQuery = "SELECT * FROM products";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//this api is for products per vet clinic
app.get("/products/:vetid", (req, res) => {
  const vet_admin_id = req.params.vetid;
  const sqlQuery = "SELECT * FROM products WHERE vetid = ?";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.post("/product/insert/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  const insertProductImage = req.body.insertProductImage;
  const insertProductName = req.body.insertProductName;
  const insertProductDescription = req.body.insertProductDescription;
  const insertProductQuantity = req.body.insertProductQuantity;
  const insertProductPrice = req.body.insertProductPrice;
  const id = Math.floor(Math.random() * 100000000);
  const insertProductCategory = req.body.insertProductCategory;
  const insertProductPetType = req.body.insertProductPetType;

  const sqlQuery =
    "INSERT INTO products (product_id,product_name,product_desc,vetid,quantity,price,product_image,category,pet_type) VALUES (?,?,?,?,?,?,?,?,?)";
  db.query(
    sqlQuery,
    [
      id,
      insertProductName,
      insertProductDescription,
      vetid,
      insertProductQuantity,
      insertProductPrice,
      insertProductImage,
      insertProductCategory,
      insertProductPetType,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/product/delete/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  const vetid = req.body.vetid;

  console.log(product_id);
  console.log(vetid);
  const sqlQuery = "DELETE FROM products WHERE product_id = ? AND vetid = ?";
  db.query(sqlQuery, [product_id, vetid], (err, result) => {
    console.log(result);
  });
});

app.post("/product/update/:productUpdateId", (req, res) => {
  const product_id = req.params.productUpdateId;
  const vetid = req.body.vetid;
  const product_name = req.body.updateProductName;
  const product_description = req.body.updateProductDescription;
  const product_quantity = req.body.updateProductQuantity;
  const product_price = req.body.updateProductPrice;

  console.log(product_id);
  console.log(vetid);
  console.log(product_name);
  console.log(product_description);
  console.log(product_price);
  console.log(product_quantity);

  const sqlQuery =
    "UPDATE products SET product_name = ?,product_desc = ?,quantity = ?,price = ?  WHERE product_id = ? AND vetid = ?";
  db.query(
    sqlQuery,
    [
      product_name,
      product_description,
      product_quantity,
      product_price,
      product_id,
      vetid,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

// Stock In
app.post("/product/update/stockin/:productUpdateId", (req, res) => {
  const product_id = req.params.productUpdateId;
  const vetid = req.body.vetid;
  const quantity = req.body.quantity;

  const sqlQuery =
    "INSERT INTO stock_in (vetid,product_id,stockin_quantity) VALUES (?,?,?)";
  db.query(sqlQuery, [vetid, product_id, quantity], (err, result) => {
    console.log(err);
  });
});

//Stock Used
app.post("/product/update/stockused/:productUpdateId", (req, res) => {
  const product_id = req.params.productUpdateId;
  const vetid = req.body.vetid;
  const quantity = req.body.quantity;

  const sqlQuery =
    "INSERT INTO stock_used (vetid,product_id,stockused_quantity) VALUES (?,?,?)";
  db.query(sqlQuery, [vetid, product_id, quantity], (err, result) => {
    console.log(err);
  });
});

//Reservation API
app.post("/products/reserve/:productId", (req, res) => {
  const product_id = req.params.productId;
  const vetid = req.body.vetid;
  const pet_owner_id = req.body.pet_owner_id;
  const quantity = req.body.quantity;

  const sqlQuery =
    "INSERT INTO reservation (product_id,pet_owner_id,vetid,reserve_val.reserve_quantityquantity,reservation_status) VALUES (?,?,?,?,?)";
  db.query(
    sqlQuery,
    [product_id, pet_owner_id, vetid, quantity, "Pending"],
    (err, result) => {
      console.log(err);
    }
  );
});

//this api is for reservation products per vet clinic
app.get("/pending/reservation/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  // console.log(pet_owner_id);
  const sqlQuery =
    "SELECT * FROM vet_clinic JOIN products ON vet_clinic.vetid = products.vetid JOIN reservation ON reservation.product_id= products.product_id JOIN pet_owners ON pet_owners.pet_owner_id = reservation.pet_owner_id WHERE vet_clinic.vetid = ? AND reservation.reservation_status='Pending'";
  db.query(sqlQuery, vetid, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});


//this api is for reservation products per pet owner
app.get("/reservation/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id);
  const sqlQuery =
    "SELECT * FROM vet_clinic JOIN products ON vet_clinic.vetid = products.vetid JOIN reservation ON reservation.product_id= products.product_id JOIN pet_owners ON pet_owners.pet_owner_id = reservation.pet_owner_id WHERE reservation.pet_owner_id = ? AND reservation.reservation_status='Pending'";
  db.query(sqlQuery, pet_owner_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});





//--------------------------------------------------------------------------//

//this api is for services

app.get("/services", (req, res) => {
  const sqlQuery = "SELECT * FROM services";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//this api is for services

app.get("/services/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  const sqlQuery = "SELECT * FROM services WHERE vetid = ?";
  db.query(sqlQuery, vetid.substring(1), (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//api for specific vet clinic
app.get("/services/details/info/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  const id = vet_admin_id.split("&")[0];
  const category = vet_admin_id.split("&")[1];
  // console.log(category);
  const sqlQuery = "SELECT * FROM services WHERE vetid = ? AND category = ?";
  db.query(sqlQuery, [id.substring(1), category], (err, result) => {
    // console.log(result);
    res.send(result);
    // console.log(result);
  });
});

//api for specific service of vet clinic
app.get("/services/details/:serviceid", (req, res) => {
  const serviceid = req.params.serviceid;
  // console.log(serviceid.substring(1));
  const sqlQuery = "SELECT * FROM services WHERE service_id = ?";
  db.query(sqlQuery, serviceid.substring(1), (err, result) => {
    // console.log(result);
    res.send(result);
    // console.log(result);
  });
});

app.post("/services/insert/:vetid", (req, res) => {
  const serviceName = req.body.serviceName;
  const serviceDescription = req.body.serviceDescription;
  const vetid = req.params.vetid;
  const service_fee = req.body.service_fee;
  const category = req.body.category;
  // console.log(service_fee);
  const sqlQuery =
    "INSERT INTO services (service_name,service_description,category,service_fee,vetid) VALUES (?,?,?,?,?)";
  db.query(
    sqlQuery,
    [
      serviceName,
      serviceDescription,
      category,
      service_fee,
      vetid.substring(1),
    ],
    (err, result) => {
      console.log(err);

      if (err === null) {
        res.send({
          message: "Success",
        });
      }
    }
  );
});

app.delete("/service/delete/:service_id", (req, res) => {
  const service_id = req.params.service_id;

  const sqlQuery = "DELETE FROM services WHERE service_id = ?";
  db.query(sqlQuery, service_id.substring(1), (err, result) => {
    console.log(result);
    if (err === null) {
      res.send({
        message: "success",
      });
    }
  });
});

app.put("/service/update/:service_id", (req, res) => {
  const service_id = req.params.service_id;
  const service_name = req.body.updateServiceName;
  const service_description = req.body.updateServiceDescription;
  const service_fee = req.body.updateServiceFee;
  const service_category = req.body.updateServiceCategory;
  // console.log(service_id + " " + service_name + " " + service_description);
  const sqlQuery =
    "UPDATE services SET service_name = ?,service_description = ? , category = ?,service_fee = ? WHERE service_id = ?";
  db.query(
    sqlQuery,
    [
      service_name,
      service_description,
      service_category,
      service_fee,
      service_id,
    ],
    (err, result) => {
      console.log(err);
      if (err === null) {
        res.send({
          message: "success",
        });
      }
    }
  );
});

//--------------------------------------------------------------------------//

//this api is for pharmacy

app.get("/pharmacy", (req, res) => {
  const sqlQuery = "SELECT * FROM pharmacy";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/pharmacy/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  const sqlQuery = "SELECT * FROM pharmacy WHERE vetid = ?";
  db.query(sqlQuery, vetid, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});



app.post("/pharmacy/insert/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  const insertMedicineImage = req.body.insertMedicineImage;
  const insertMedicineName = req.body.insertMedicineName;
  const insertMedicineDescription = req.body.insertMedicineDescription;

  const insertMedicinePrice = req.body.insertMedicinePrice;
  const id = Math.floor(Math.random() * 100000000);

  const sqlQuery =
    "INSERT INTO pharmacy (medicine_name,medicine_description,status,price,vetid,medicine_image,med_id) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sqlQuery,
    [
      insertMedicineName,
      insertMedicineDescription,
      true,
      insertMedicinePrice,
      vetid,
      insertMedicineImage,
      id,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/pharmacy/delete/:medicine_id", (req, res) => {
  const medicine_id = req.params.medicine_id;
  const vetid = req.body.vetid;
  // console.log(medicine_id);
  // console.log(vetid);
  const sqlQuery = "DELETE FROM pharmacy WHERE med_id = ? AND vetid = ?";
  db.query(sqlQuery, [medicine_id, vetid], (err, result) => {
    console.log(err);
  });
});

app.post("/pharmacy/update/:pharmacyUpdateId", (req, res) => {
  const medicine_id = req.params.pharmacyUpdateId;
  const vetid = req.body.vetid;
  const medicine_image = req.body.medicine_image;
  const medicine_name = req.body.medicine_name;
  const medicine_description = req.body.medicine_description;
  const medicine_price = req.body.medicine_price;
  const status = req.body.status;

  console.log(medicine_id);
  console.log(vetid);
  console.log(medicine_image);
  console.log(medicine_name);
  console.log(medicine_description);
  console.log(medicine_price);
  console.log(status);

  const sqlQuery =
    "UPDATE pharmacy SET medicine_name = ?,medicine_description = ?,status = ? ,price = ?,medicine_image = ? WHERE med_id = ? AND vetid = ?";
  db.query(
    sqlQuery,
    [
      medicine_name,
      medicine_description,
      status,
      medicine_price,
      medicine_image,
      medicine_id,
      vetid,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

//--------------------------------------------------------------------------//

//this api is for History

//this api for history of system admin
app.get("/history", (req, res) => {
  const sqlQuery = "SELECT * FROM history";
  db.query(sqlQuery, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//this api for history of pet owner
app.get("/history/petowner/:petOwnerId", (req, res) => {
  const petOwnerId = req.params.petOwnerId;
  const sqlQuery = "SELECT * FROM history WHERE pet_owner_id = ?";
  db.query(sqlQuery, petOwnerId, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//this api for history of vet clinic
app.get("/history/vetclinic/:vetAdminId", (req, res) => {
  const vetAdminId = req.params.vetAdminId;
  // console.log(vetAdminId);
  const sqlQuery = "SELECT * FROM history WHERE vet_admin_id = ?";
  db.query(sqlQuery, vetAdminId, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//this api is for vet clinic
app.post("/history/vetclinic/insert/:vet_admin_id", (req, res) => {
  const pet_owner_id = req.body.pet_owner_id;
  const appointment_id = req.body.appointment_id;
  const date_and_time = new Date().getDate();

  const sqlQuery =
    "INSERT INTO history (type_of_transaction,pet_owner_id,appointment_id,date_and_time,remarks) VALUES (?,?,?,?,?)";
  db.query(
    sqlQuery,
    ["Appointment", pet_owner_id, appointment_id, date_and_time, "Done"],
    (err, result) => {
      console.log(err);
    }
  );
});

//--------------------------------------------------------------------------//

//this api is for dashboard of system admin
app.get("/petowner/length", (req, res) => {
  const sqlQuery = "SELECT * FROM pet_owners";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      petOwners: result.length,
    });
  });
});

app.get("/petowners/addpet", (req, res) => {
  const sqlQuery = "SELECT pet_owner_id,name FROM pet_owners";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      petOwners: result,
    });
  });
});

app.get("/pets/length", (req, res) => {
  const sqlQuery = "SELECT * FROM pets";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      pets: result.length,
    });
  });
});

app.get("/vetclinic/length", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      vetclinic: result.length,
    });
  });
});

app.get("/pending/vetclinic/length", (req, res) => {
  const sqlQuery = "SELECT * FROM vet_clinic WHERE vet_status = 'Pending'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      pending: result.length,
    });
  });
});

app.get("/pets/dog", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Dog'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      dog: result.length,
    });
  });
});

app.get("/pets/cat", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Cat'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      cat: result.length,
    });
  });
});

app.get("/pets/fish", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Fish'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      fish: result.length,
    });
  });
});

app.get("/pets/bird", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Bird'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      bird: result.length,
    });
  });
});

app.get("/pets/turtle", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Turtle'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      turtle: result.length,
    });
  });
});

app.get("/pets/hamster", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE type_of_pet = 'Hamster'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      hamster: result.length,
    });
  });
});

app.get("/pets/gender/male", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE gender = 'Male'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      male: result.length,
    });
  });
});

app.get("/pets/gender/female", (req, res) => {
  const sqlQuery = "SELECT * FROM pets WHERE gender = 'Female'";
  db.query(sqlQuery, (err, result) => {
    // console.log(result.length);
    res.send({
      female: result.length,
    });
  });
});

//--------------------------------------------------------------------------//
//this api is for dashboard of vet admin

app.get("/pets/:id", (req, res) => {
  const vetAdminId = req.params.id.substring(1);
  // console.log(vetAdminId);
  const sqlQuery =
    "SELECT medical_history.medical_history_id, pets.pet_name,pets.type_of_pet,pets.breed_of_pet,pets.gender FROM pets INNER JOIN medical_history ON pets.pet_id=medical_history.pet_id WHERE vet_admin_id = ?;";
  db.query(sqlQuery, vetAdminId, (err, result) => {
    // console.log(err);
    res.send(result);
    // console.log(result)
  });
});

//--------------------------------------------------------------------------//
//Appointments API
app.post("/appointment/set", (req, res) => {
  const vet_admin_id = req.body.vet_admin_id;
  const pet_owner_id = req.body.pet_owner_id;
  const pet_id = req.body.pet_id;
  const dateSet = req.body.dateSet;
  const timeSet = req.body.timeSet;
  const service_id = req.body.service_id;

  const sqlQuery =
    "INSERT INTO appointment (vetid,pet_owner_id,pet_id,time_scheduled,date_scheduled,service_id,appointment_status) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sqlQuery,
    [
      vet_admin_id,
      pet_owner_id,
      pet_id,
      timeSet,
      dateSet,
      service_id,
      "Pending",
    ],
    (err, result) => {
      console.log(err);
      if (err === null) {
        res.send({
          message: "Success",
        });
      }
    }
  );
});

app.get("/appointments/:pet_owner_id", (req, res) => {
  const pet_owner_id = req.params.pet_owner_id;
  // console.log(pet_owner_id)
  const sqlQuery = `SELECT * FROM appointment INNER JOIN services ON  appointment.service_id = services.service_id INNER JOIN vet_clinic ON vet_clinic.vetid = appointment.vetid WHERE pet_owner_id = ?`;

  db.query(sqlQuery, pet_owner_id.substring(1), (err, result) => {
    // console.log(err);
    if (err === null) {
      res.send(result);
      // console.log(result);
    } else {
      console.log(err);
    }
  });
});

//API for Pending Appointments
app.get("/pending/appointment/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  // console.log(vet_admin_id)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.vetid = ? AND appointment.appointment_status='Pending'";
  db.query(sqlQuery, vet_admin_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//API for General Appointments
app.get("/general/appointment/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  // console.log(vetid)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.vetid = ? AND appointment.appointment_status='Approved'";
  db.query(sqlQuery, vetid, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//API for Appointment history
app.get("/history/appointment/:vetid", (req, res) => {
  const vetid = req.params.vetid;
  // console.log(vetid)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.vetid = ? AND appointment.appointment_status='Done' OR appointment.appointment_status='Decline'";
  db.query(sqlQuery, vetid, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//API for View details Appointments
app.get("/pending/appointment/viewdetails/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  // console.log(appointment_id)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.appointment_id = ? AND appointment.appointment_status='Pending'";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//API for View details Appointments history
app.get("/appointment/viewdetails/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  // console.log(appointment_id)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.appointment_id = ? AND appointment.appointment_status='Done' OR appointment.appointment_status='Decline'";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

//API for View details confirm Appointments
app.get("/confirm/appointment/viewdetails/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  // console.log(appointment_id)
  const sqlQuery =
    "SELECT * FROM pet_owners JOIN appointment ON pet_owners.pet_owner_id=appointment.pet_owner_id JOIN services ON services.service_id=appointment.service_id WHERE appointment.appointment_id = ? AND appointment.appointment_status='Approved'";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

app.get("/vetclinic/services/:service_id", (req, res) => {
  const service_id = req.params.service_id;
  // console.log(service_id)
  const sqlQuery = "SELECT * FROM services WHERE service_id = ? ";
  db.query(sqlQuery, service_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

// API for accepting appointment
app.put("/vetclinic/appointment/accept/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  console.log(appointment_id);
  const sqlQuery =
    "UPDATE appointment SET appointment_status = 'Approved' WHERE appointment_id = ? ";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

// API for declining appointment
app.put("/vetclinic/appointment/decline/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  console.log(appointment_id);
  const sqlQuery =
    "UPDATE appointment SET appointment_status = 'Decline' WHERE appointment_id = ? ";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

// API for finishing appointment
app.put("/vetclinic/appointment/done/:appointment_id", (req, res) => {
  const appointment_id = req.params.appointment_id;
  console.log(appointment_id);
  const sqlQuery =
    "UPDATE appointment SET appointment_status = 'Done' WHERE appointment_id = ? ";
  db.query(sqlQuery, appointment_id, (err, result) => {
    // console.log(result);
    res.send(result);
  });
});


//--------------------------------------------------------------------------//
// Talk to vet

//add thread
app.post("/talktovet/thread/creating", (req, res) => {
  const pet_owner_id = req.body.pet_owner_id;
  const vetid = req.body.vetid;
  // console.log(vetid);
  const sqlQuery =
    "INSERT INTO thread (pet_owner_id,vetid) VALUES (?,?) ";
  db.query(sqlQuery, [pet_owner_id, vetid], (err, result) => {
    // console.log(result);
    res.send(result);
  });
});

// Get Thread Vet Clinic
app.post("/talktovet/vetclinic/thread", (req, res) => {
  const vetid = req.body.vetid;

  // console.log(vetid);
  const sqlQuery =
    `SELECT * FROM pet_owners JOIN thread ON pet_owners.pet_owner_id = thread.pet_owner_id JOIN vet_clinic ON vet_clinic.vetid = thread.vetid WHERE vet_clinic.vetid = ? ORDER BY thread.thread_id ASC`;
  db.query(sqlQuery, vetid, (err, result) => {
    // console.log(result);
    res.send(result);
  });
})



// Get Thread and message for Vet Clinic
app.post("/talktovet/vetclinic/messages", (req, res) => {
  const thread_id = req.body.thread_id;

  console.log(thread_id);
  const sqlQuery =
    `SELECT thread.thread_id, vet_clinic.vet_name,vet_clinic.vet_picture,pet_owners.name,pet_owners.profilePicture,messages.user_message,messages.message_content,messages.created_time_date FROM pet_owners JOIN messages ON pet_owners.pet_owner_id = messages.pet_owner_id JOIN thread ON thread.thread_id = messages.thread_id JOIN vet_clinic ON vet_clinic.vetid = thread.vetid WHERE thread.thread_id= ? ORDER BY messages.created_time_date ASC`;
  db.query(sqlQuery, thread_id, (err, result) => {
    console.log(result);
    res.send(result);
  });
})


// Send message for Vet Clinic
app.post("/talktovet/vetclinic/messages/sent", (req, res) => {
  const thread_id = req.body.thread_id;
  const pet_owner_id = req.body.pet_owner_id;
  const vetid = req.body.vetid;
  const user = req.body.user;
  const message = req.body.message;


  const sqlQuery =
    `INSERT INTO messages (thread_id,pet_owner_id,vetid,user_message,message_content) VALUES (?,?,?,?,?)`;
  db.query(sqlQuery, [thread_id, pet_owner_id, vetid, user, message], (err, result) => {
    console.log(err);
    res.send(result);
  });
})


//--------------------------------------------------------------------------//

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}

//--------------------------------------------------------------------------//

//API for dashboard in vet clinic
app.get("/pets/vetclinic/length/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  //console.log(vet_admin_id)
  const sqlQuery =
    "SELECT DISTINCT pet_id FROM appointment where vet_admin_id=?";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    // console.log(result.length);
    console.log(vet_admin_id);
    res.send({
      // pets: result.length,
      pets: 4,
    });
  });
});

app.get("/petowner/vetclinic/length/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  //console.log(vet_admin_id)
  const sqlQuery =
    "SELECT DISTINCT pet_owner_id FROM appointment where vet_admin_id=?";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    res.send({
      petOwners: 4,
    });
  });
});

app.get("/pending/vetclinic/length/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;
  //console.log(vet_admin_id)
  const sqlQuery =
    "SELECT * FROM appointment WHERE vet_admin_id=? && appointment_status='Pending'";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    res.send({
      pending: 4,
    });
  });
});

//Animal population Graph
//Dog (Specific individual pets query)
app.get("/dog/total/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "SELECT DISTINCT appointment.pet_id, pets.type_of_pet FROM pets JOIN appointment ON pets.pet_id=appointment.pet_id WHERE appointment.vet_admin_id=? && pets.type_of_pet='Dog'";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    res.send({
      dog: result.length,
    });
  });
});

//Dynamic type of pets and its value
app.get("/total/animal/population/:vet_admin_id", (req, res) => {
  const vet_admin_id = req.params.vet_admin_id;

  const sqlQuery = "SELECT type_of_pet,  COUNT( DISTINCT appointment.pet_id) AS 'TOTAL' FROM pets JOIN appointment ON pets.pet_id=appointment.pet_id WHERE appointment.vet_admin_id=? GROUP BY type_of_pet";
  db.query(sqlQuery, vet_admin_id.substring(1), (err, result) => {
    res.send(result);
  });
});




//------------------------------------------------------------------------------------------------------------------

app.listen(process.env.PORT || 3001, () => {
  console.log("Running  Server");
});
