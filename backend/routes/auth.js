const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER
router.post("/register", async (req,res)=>{
  try{
    const {name,email,username,password} = req.body

    const hashedPassword = await bcrypt.hash(password,10)

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword
    })

    await user.save()

    res.json({message:"User Registered"})
  }catch(err){
    res.status(400).json({error:err.message})
  }
})

// LOGIN
router.post("/login", async (req,res)=>{
  try{
    const {username,password} = req.body

    const user = await User.findOne({username})
    if(!user) return res.status(400).json({error:"User not found"})

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return res.status(400).json({error:"Invalid password"})

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.json({token,user})
  }catch(err){
    res.status(400).json({error:err.message})
  }
})

module.exports = router