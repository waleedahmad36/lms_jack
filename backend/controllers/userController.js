import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate role
    const validRoles = ["admin", "student", "instructor"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check for existing user by email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Check for existing user by username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "", // Exclude password from response
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("mern_lms");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Auth Check Controller
export const authCheck = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in authCheck controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






// Profile Update Controller
export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user._id; // Assumes user ID is extracted from the authenticated token
    let profilePicUrl = null;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Handle profilePic upload to Cloudinary
    if (req.file) {
      // Remove old profilePic from Cloudinary if it exists
      if (user.profilePic) {
        const oldPublicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(oldPublicId);
      }

      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      profilePicUrl = uploadResult.secure_url;
    }

    // Update user details
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePicUrl) user.profilePic = profilePicUrl;

    // Save changes
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
