import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Register User POST REQUEST
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();

    const isAdmin =
      process.env.ADMIN_EMAILS?.split(",").includes(email) || false;

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        isAdmin,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      encode: (val) => val, // Disable encoding
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        isAdmin,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err });
  }
};

// Login User POST REQUEST

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isAdmin =
      process.env.ADMIN_EMAILS?.split(",").includes(email) || false;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "2d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      encode: (val) => val, // Disable encoding
    });

    res.status(200).json({
      message: "User loggedin successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin,
      },
    });
  } catch (error) {
    console.log("LogIn error:", error);
    res.status(500).json({ message: "LogIn failed", error });
  }
};

//Logout user POST REQUEST

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("email", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error while logout", error);
    res.status(500).json({ message: "Logout failed", error });
  }
};


//Get User Details GET REQUEST
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    // The user is already verified by authValidate middleware
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      const isAdmin =
        process.env.ADMIN_EMAILS?.split(",").includes(user.email) || false;
      res.status(200).json({ user, isAdmin });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};

// Update User Profile PUT REQUEST
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, address } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: process.env.ADMIN_EMAILS?.split(",").includes(user.email) || false,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};