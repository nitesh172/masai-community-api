const express = require("express")

const app = express()

const cors = require("cors")

app.use(express.json())

app.use(cors())

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))

const userController = require("./Controllers/user.controller")
const {
  register,
  login,
  confirmUser,
  profile
} = require("./Controllers/auth.controller")

app.use("/users", userController)
app.post("/register", register)
app.post("/login", login)

app.get("/confrimation/:token", confirmUser)
app.get("/profile/:token", profile)

module.exports = app
