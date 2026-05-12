const User = require("../models/userModel");

const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

class AuthController {
 
  async register(req, res) {
   
    try {
      const { name, email, password, phone,role } = req.body;
      

      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          message: "All field are required",
        });
      }

      const existUser = await User.findOne({ email });

      if (existUser) {
        return res.status(400).json({
          message: "Admin already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);

      const hashPassword = await bcrypt.hash(password, salt);

      const userdata = new User({
        name,
        email,
        password: hashPassword,
        phone,
        role: role || "admin",
      });

      if (req.file) {
        userdata.avatar = req.file.path;

        userdata.cloudinaryid = req.file.filename;
      }

      const result = await userdata.save();

      if (result) {
        return res.status(201).json({
          success: true,
          message: "Admin created successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      const existuser = await User.findOne({ email });

      if (!existuser) {
        return res.status(400).json({
          success: false,
          message: "Admin not found",
        });
      }

      let isCheck = await bcrypt.compare(String(password), existuser.password);

      if (!isCheck) {
        return res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const token = jwt.sign(
        {
          id: existuser._id,
          name: existuser.name,
          email: existuser.email,
          phone: existuser.phone,
          role: existuser.role,
        },
        process.env.JWT_SECRECT,
        { expiresIn: "1h" },
      );

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        data: {
          id: existuser._id,
          name: existuser.name,
          email: existuser.email,
          password: existuser.password,
          role: existuser.role
        },
        token: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existuser = await User.findOne({ email });

      if (existuser.avatar) {
        let deletedImage = await cloudinary.uploader.destroy(
          existuser.cloudinaryid,
        );
      }

      if (!existuser) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      let isCheck = await bcrypt.compare(String(password), existuser.password);

      if (isCheck) {
        await User.findOneAndDelete({ email });

        return res.status(200).json({
          success: true,
          message: "Logout",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
