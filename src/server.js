const app = require("./index")

const port = process.env.PORT || 2001
const connection = require("./Configs/db")

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

module.exports = io
