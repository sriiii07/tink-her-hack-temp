const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

router.get("/live", auth, (req,res)=>{
  res.json({
    vehicles: Math.floor(Math.random()*1000),
    congestion: Math.floor(Math.random()*100),
    incidents: Math.floor(Math.random()*10)
  })
})

module.exports = router