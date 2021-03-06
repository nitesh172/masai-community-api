const express = require("express")
const Emitter = require("events")

const app = express()

const cors = require("cors")

const eventEmitter = new Emitter()

app.set("eventEmitter", eventEmitter)

app.use(express.json())

app.use(cors())

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))

const userController = require("./Controllers/user.controller")
const {
  register,
  login,
  confirmUser,
  profile,
  updateUserDetails,
} = require("./Controllers/auth.controller")

app.use("/users", userController)
app.post("/register", register)
app.post("/login", login)

app.get("/confrimation/:token", confirmUser)
app.post("/userUpdateDetails/:token", updateUserDetails)
app.get("/profile/:token", profile)


module.exports = app
