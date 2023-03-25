const { makeVerifyEmail, transport } = require("./nodemailer");
const makeJimp = require("./makeJime");

module.exports = {
    makeVerifyEmail,
    transport,
    makeJimp
}