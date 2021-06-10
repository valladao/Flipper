const express = require("express")
const app = express()
const path = require("path")
const redis = require("redis")
const client = redis.createClient()
const bcrypt = require("bcrypt")

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => res.render("index"))

app.post("/", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render("error", {
      message: "Please set both username and password",
    })
    return
  }

  console.log(req.body, username, password)

  client.hget("users", username, (err, userid) => {
    if (!userid) {
      //user does not exist, signup procedure
      client.incr("userid", async (err, userid) => {
        client.hset("users", username, userid)
        const saltRounds = 10
        const hash = await bcrypt.hash(password, saltRounds)
        client.hset(`user:${userid}`, "hash", hash, "username", username)
      })
    } else {
      //user exists, login procedure
      client.hget(`user:${userid}`, "hash", async (err, hash) => {
        const result = await bcrypt.compare(password, hash)
        if (result) {
          //password ok
        } else {
          //wrong password
        }
      })
    }
  })

  res.end()
})

app.listen(3000, () => console.log("Server ready"))
