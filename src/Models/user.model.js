const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: Number,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    joined: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    batch: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
      default: "https://i.postimg.cc/MTw0t80t/pngegg-1.png",
    },
    place: {
      type: String,
      required: false,
    },
    follower: {
      type: Array,
      required: false,
    },
    following: {
      type: Array,
      required: false,
    },
    Status: {
      type: String,
      required: false
    },
    level: {
      type: Number,
      required: false,
      default: 1
    },
    questionAnswered: {
      type: Number,
      required: false,
      default: 0
    },
    questionAsked: {
      type: Number,
      required: false,
      default: 0
    },
    confirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)


userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next()
  this.password = bcrypt.hashSync(this.password, 8);
  return next()
})



module.exports = mongoose.model("user", userSchema)