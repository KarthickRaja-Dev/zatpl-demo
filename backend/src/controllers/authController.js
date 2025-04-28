import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
configDotenv();
console.log(process.env.JWT_SECRET);
const generateToken = (userId, role, email) => {
  const token = jwt.sign({ id: userId, role, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        message: "registration successful",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = {
      _id: "67e4fd9215e6471be4a3cbe345",
      name: "Admin",
      email: "zenjade@gmail.com",
      password: "$2b$10$7EeXjZNqXmQmw/i5cgpiOOFlC30gLIxQNGfzo7pyAOqn8E/zGQ5Ha",
      role: "admin",
    };
    const user = await User.findOne({ email });
    if (!user) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        const adminToken = generateToken(admin._id, admin.role, admin.email);
        console.log(adminToken);
        res.json({
          admin,
          adminToken,
        });
        return;
      }

      return res.status(401).json({ message: "User Not Found" });
    }
    const isMatch = await user.matchPassword(password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role, user.email);
    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffs = async (req, res) => {
  try {
    const users = await User.find({ role: "staff" });
    res.json({
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
