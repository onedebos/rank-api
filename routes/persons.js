const express = require("express");
const router = express.Router();
const helper = require("../middleware/helpers");
let Person = require("../models/Person");

router.route("/").get((req, res) => {
  console.log("getting all persons...");
  Person.find()
    .then(persons => res.json(persons))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/latest").get((req, res) => {
  Person.findOne()
    .sort({ field: "asc", _id: -1 })
    .limit(1)
    .then(person => res.json(person))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const dateOfBirth = new Date(req.body.dateOfBirth);
  const data = {
    from: "Adebola <me@samples.mailgun.org>",
    to: "onedebos@gmail.com",
    subject: `${name} has been added`,
    html: `
    <html>
    <p>Hi </p>
    <p>Welcome to our network! Here's your profile information.</p>
    <p>Email: ${email} </p>
    <p> Date of Birth: ${dateOfBirth.toISOString().slice(0, 10)}</p>
    <p> Server used: ${helper.getMachineName()} </p>
  
    </html>
    `
  };

  const newPerson = new Person({ name, email, dateOfBirth });
  newPerson
    .save()
    .then(() => {
      res.json(newPerson);
      helper.appendData(newPerson);
      helper.sendEmail(data);
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
