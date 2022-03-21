const redis = require("redis")

const client = redis.createClient({
  url: "redis://:pbe0c695280fdaa2d754bed36a43164cdc13a4f93de6c21eb455586839fc08bab@ec2-34-192-193-72.compute-1.amazonaws.com:9279",
})

client.on("connect", (err) => {
  if (err) console.log(err.message)
  console.log("Connected!")
})

module.exports = client
