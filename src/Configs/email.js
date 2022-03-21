const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "communitymasai@gmail.com",
    pass: "masaicommunity12"
  },
})



module.exports = transport


