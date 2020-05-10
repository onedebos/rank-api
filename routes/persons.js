const express = require("express");
const router = express.Router();
const helper = require("../middleware/helpers");
let Person = require("../models/Person");
const mongoose = require("mongoose");
const connection = mongoose.connection;

router.route("/").get((req, res) => {
  Person.find()
    .then(persons => res.json(persons))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/latest").get((req, res) => {
  Person.find()
    .sort({ createdAt: "desc" })
    .limit(1)
    .then(persons => {
      res.json(persons.map(person => person.toJSON()));
      connection.close();
    })
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.map(person => person.toJSON()));
      connection.close();
    })
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/:id").delete((req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Person has been deleted!" });
      connection.close();
    })
    .catch(() =>
      res.status(400).json("Error: Couldn't find a person with that ID")
    );
});

router.route("/").post((req, res) => {
  const { name, email } = req.body;
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
      res.json(newPerson.toJSON());
      helper.appendData(newPerson);
      // helper.sendEmail(data);
      connection.close();
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
