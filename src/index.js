const express = require("express")

const app = express()

const cors = require("cors")

app.use(express.json())

app.use(cors())

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))

const userController = require("./Controllers/user.controller")
const { register, login, verifyToken } = require("./Controllers/auth.controller")
const userModel = require("./Models/user.model")
const redis = require("./Configs/redis")

app.use("/users", userController)
app.post("/register", register)
app.post("/login", login)

app.get("/confrimation/:token", async (req, res) => {
  try {
    const user = await verifyToken(req.params.token)

    if (!user) return res.status(402).send({ message: "invalid token" })

    user.user.confirmed = true

    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        user.user._id,
        user.user,
        {
          new: true,
        }
      )
        .lean()
        .exec()

      RedisClient.get(`User.${user.user._id}`, async (err, fetchedPost) => {
        if (err) console.log(err.message)

        redis.set(`User.${user.user._id}`, JSON.stringify(user.user))

        const users = await User.find().lean().exec()
        redis.set(`User`, JSON.stringify(users))
      })

      res.status(200).render("confirmmail.ejs", {
        updatedUser,
        message: "Verification Sucessfull",
      })
    } catch (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
})

module.exports = app
