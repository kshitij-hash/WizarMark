const User = require("../models/User");
const generateToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
        const isPasswordMatch = await user.comparePassword(password);
  
        if (isPasswordMatch || (password==user.password)) {
        res.cookie("user_id", user._id.toString());
        res.json({
          _id: user._id,
          name: user.name,
            email: user.email,
          bookmarks: user.bookmarks,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password11" });
      }
    } else {
      res.status(401).json({ message: "User with this email doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Failed" });
  }
});



const signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error("Please enter all the fields");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Fail to create new user");
    }
  } catch (error) {
    console.error("something went wrong", error);
    res.status(500);
    throw new Error("SignUp failed");
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("user_id");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout Failed" });
  }
});


module.exports = { login, signup, logout };
