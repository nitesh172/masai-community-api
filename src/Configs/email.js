const nodemailer = require("nodemailer")
require("dotenv").config()

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass
  },
})



module.exports = transport


