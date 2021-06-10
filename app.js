const express = require("express")
const app = express()
const path = require("path")

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
  res.end()
})

app.listen(3000, () => console.log("Server ready"))
