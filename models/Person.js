const mongoose = require("mongoose");

const validateEmail = email => {
  const expression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
};

const validateDob = dateOfBirth => {
  let dobYr = new Date(dateOfBirth);
  dobYr = dobYr.getFullYear();
  const currentYr = new Date().getFullYear();
  const difference = currentYr - dobYr;
  if (difference < 16 || difference > 120) {
    return false;
  } else {
    return true;
  }
};

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: email => validateEmail(email),
      message: () => "not a valid email"
    }
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: dateOfBirth => validateDob(dateOfBirth),
      message: () => "age must be greater than 16 and less than 120 years"
    }
  },
  createdAt: { type: Date, default: Date.now }
});

PersonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", PersonSchema);
