import jwt from "jsonwebtoken";
import User from "../model/User.js";

// Hardcoded admin credentials
const adminUser = {
  _id: "67e4fd9215e6471be4a3cbe345",
  name: "Admin",
  email: "zenjade@gmail.com",
  role: "admin",
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extracts the token part after "Bearer "
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id).select("-password");
    if (!user && decoded.email === adminUser.email) {
      user = adminUser;
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    //console.log("Role :",user.role)
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to allow only admins
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Middleware to allow only staff
export const staffOnly = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Staff only." });
  }
};

// Middleware to allow both admins and staff
export const adminOrStaff = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};
