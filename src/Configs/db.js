const mongoose = require("mongoose")

const connection = () => {
  return mongoose
    .connect(
      "mongodb+srv://masaicommunity:rGe7TbQ0QRyCTmi4@cluster0.gvwoa.mongodb.net/masaicommunity"
    )
    .then(() => {
      console.log("Connected")
    })
}

module.exports = connection
