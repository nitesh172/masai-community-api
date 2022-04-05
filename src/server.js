const app = require("./index")

const port = process.env.PORT || 2001
const connection = require("./Configs/db")
const eventEmitter = app.get("eventEmitter")

const server = app.listen(port, async () => {
  try {
    console.log(`Running on Port ${port}`)
    await connection()
  } catch (error) {
    console.log(error.message)
  }
})

const io = require("socket.io")(server)

io.on("connection", (socket) => {
  console.log(socket.id)
  socket.on("registerSucessfull", (userId) => {
    console.log(userId)
    socket.join(userId)
  })
})

eventEmitter.on("userConfirmed", (data) => {
  console.log(data._id)
  io.to(`user_${data._id}`).emit("userConfirmed", data)
  console.log("success")
})

eventEmitter.on("userUpdated", (data) => {
  console.log(data._id)
  io.to(`user_${data._id}`).emit("userUpdated", data)
  console.log("success")
})
