require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/traffic", require("./routes/traffic"))

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log(err))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log("Server running on port " + PORT))

// For SPA routing: send index.html for any non-API request
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).end()
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
})