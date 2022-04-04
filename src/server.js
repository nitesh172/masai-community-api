const app = require("./index")

const port = process.env.PORT || 2001
const connection = require("./Configs/db")
// const eventEmitter = require('./index')

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
  console.log("connected")
  // socket.on("registerSucessfull", (userId) => {
  //   socket.join(userId)
  // })
})

// eventEmitter.on("userConfirmed", (data) => {
//   io.to(`user_${data._id}`).emit("userConfirmed", data)
// })
