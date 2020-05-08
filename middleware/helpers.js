const fs = require("fs");
const os = require("os");
const mailgun = require("mailgun-js");

const mg = mailgun({
  apiKey: process.env.API_KEY,
  domain: process.env.DOMAIN
});

const sendEmail = emailInfo => {
  mg.messages().send(emailInfo, function(err, body) {
    console.log(err, body, "data", emailInfo);
  });
};

const appendData = data => {
  fs.appendFile("persons.txt", data, err => {
    if (err) throw err;
    console.log("saved to persons.txt");
  });
};

const getMachineName = () => {
  return os.hostname();
};

module.exports = { appendData, getMachineName, sendEmail };
