import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { User } from "../models/userModel.js";
config({ path: "./config/config.env" });
const SECRET_KEY=process.env.SECRET_KEY;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status:false, message: "Missing required fields" });
    }

    const existingUser=await User.findOne({email})
    if(existingUser){
      return res.status(400).json({ status:false, message: "Email Already registered" });
    }
    const isAdminUser = username === "newhospitalpharmacy" ? true : false;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username,email, password: hashedPassword, isAdmin: isAdminUser });
    
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.SECRET_KEY, { expiresIn: "1hr" });

    return res.status(201).json({
      status:true, 
      message: "User registered successfully!",
      token:token,
      isAdmin:newUser.isAdmin ,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      }
    });
  } catch (error) {
    return res.status(400).json({ 
      status:false, 
      message: "Something went wrong", 
      error:error.message,
     });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({status:true, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: "1hr" });

    return res.status(201).json({ 
      status:true, 
      message:"Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token:token, 
      isAdmin:user.isAdmin });
  } catch (err) {
    res.status(400).json({ status:false, message:"Something went wrong", error: err.message });
  }
};