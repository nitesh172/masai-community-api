require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const redis = require("../Configs/redis")
const emailCode = require("../Configs/emailCode")
const transporter = require("../Configs/email")
const User = require("../Models/user.model")
const redis = require("../Configs/redis")

const newToken = (user) => {
  return jwt.sign({ user: user }, process.env.sign)
}

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.sign, function (err, decoded) {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec()

    if (user) return res.status(401).send({ message: "User already Exists" })

    user = await User.create({
      ...req.body,
      profilePic: req.file?.location,
    })

    const token = newToken(user)

    const url = `https://masai-community.herokuapp.com/confrimation/${token}`

    const mailOptions = {
      from: process.env.user, // sender address
      to: req.body.email, // list of receivers
      subject: "Confirm your gmail", // Subject line
      html: `${emailCode(url)}`, // plain text body
    }

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err)
      else console.log(info)
    })

    redis.get(`User`, async (err, value) => {
      if (err) console.log(err)

      if (value) {
        value = JSON.parse(value)
        redis.set(`User`, JSON.stringify([...value, user]))
      } else {
        value = await User.find().lean().exec()
        redis.set(`User`, JSON.stringify(value))
      }
    })

    return res
      .status(201)
      .send({ user, token, message: "Registration sucessfull" })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec()

    if (!user) return res.status(401).send({ message: "User not Found" })

    const match = bcrypt.compareSync(req.body.password, user.password)

    if (!match) return res.status(401).send({ message: "Password Invalid" })

    if (!user.confirmed)
      return res.status(403).send({ message: "First verify your Email" })

    const token = newToken(user)

    return res.status(201).send({ user, token, message: "Login sucessfull" })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

const confirmUser = async (req, res) => {
  try {
    const user = await verifyToken(req.params.token)

    if (!user) return res.status(402).send({ message: "invalid token" })

    user.user.confirmed = true

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user.user._id,
        user.user,
        {
          new: true,
        }
      )
        .lean()
        .exec()

      redis.get(`User.${user.user._id}`, async (err, fetchedPost) => {
        if (err) console.log(err.message)

        redis.set(`User.${user.user._id}`, JSON.stringify(user.user))

        const users = await User.find().lean().exec()
        redis.set(`User`, JSON.stringify(users))
      })
      const eventEmitter = req.app.get("eventEmitter")

      eventEmitter.emit('userConfirmed', updatedUser)
      res.status(200).redirect("http://localhost:3000/verifyEmail")
    } catch (error) {
      console.log(error.message)
      res.status(500).send(error.message)
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message)
  }
}

const profile = async (req, res) => {
  try {
    const user = await verifyToken(req.params.token)

    if (!user) return res.status(402).send({ message: "invalid token" })

    return res.status(200).send(user.user)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

module.exports = {
  register,
  login,
  verifyToken,
  newToken,
  confirmUser,
  profile,
}
