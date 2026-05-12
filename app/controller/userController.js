const User = require("../models/userModel");

const fs = require('fs');
const path = require('path')


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

class UserController {

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
                    message: "user not found",
                });
            }

            let isCheck = await bcrypt.compare(password, existuser.password);

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
                message: "User logged in successfully",
                data: {
                    id: existuser._id,
                    name: existuser.name,
                    email: existuser.email,
                    password: existuser.password,
                    profileImage: existuser.profileImage
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

    async getUsers(req, res) {
        try {
            const allusers = await User.find({ role: ['employee', 'manager'] });

            if (!allusers) {

                return res.status(400).json({
                    success: false,
                    message: "User not found",

                });

            }

            return res.status(200).json({
                success: true,
                message: "All user gets successfully",
                data: allusers
            });


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getUserById(req, res) {
        try {
            const id = req.params.id;

            const existuser = await User.findById(id);

            if (!existuser) {
                return res.status(400).json({
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "User gets successfully",
                data: existuser,

            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async createUser(req, res) {
        try {

            const { name, email, phone, password, role } = req.body;

            if (!name || !email || !phone || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: "All field are required",
                });
            }

            const existUser = await User.findOne({ email });

            if (existUser) {
                return res.status(400).json({
                    message: "User already exist",
                });
            }

            const salt = await bcrypt.genSalt(10);

            const hashPassword = await bcrypt.hash(password, salt);

            const userdata = new User({
                name,
                email,
                phone,
                password: hashPassword,
                role
            });

            if (req.file) {

                userdata.avatar = req.file.path,
                    userdata.cloudinaryid = req.file.filename
            }

            const result = await userdata.save();

            if (result) {
                return res.status(201).json({
                    success: true,
                    message: "User created successfully",
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

    async updateUser(req, res) {
        try {

            const id = req.params.id;

            const existUser = await User.findById(id)

            if (!existUser) {
                return res.status(400).json({
                    success: false,
                    message: "User not exist",
                });
            }


            const { name, email, phone, role, avatar } = req.body;

            if (req.file) {
                if (existUser.avatar) {
                    let deletedImage = await cloudinary.uploader.destroy(
                        existUser.cloudinaryid,
                    );
                }

                existUser.avatar = req.file.path;
                existUser.cloudinaryid = req.file.filename;
            }

            existUser.name = name || existUser.name;
            existUser.email = email || existUser.email;
            existUser.phone = phone || existUser.phone;
            existUser.role = role || existUser.role;
            existUser.avatar = avatar || existUser.avatar;

            const updateuser = await existUser.save();

            if (updateuser) {
                return res.status(201).json({
                    success: true,
                    message: 'User updated successfully',
                    data: updateuser
                });
            }

            return res.status(400).json({
                success: false,
                message: 'User not updated',
            });


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteUser(req, res) {
        try {

            const id = req.params.id;

            const existUser = await User.findById(id)

            if (!existUser) {
                return res.status(400).json({
                    success: false,
                    message: "User not exist",
                });
            }
            if (existUser.avatar) {
                let deletedImage = await cloudinary.uploader.destroy(
                    existUser.cloudinaryid,
                );
            }

            const deleteUser = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true })


            return res.status(200).json({
                success: true,
                message: 'User deleted successfully',

            });


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async updateStatusUser(req, res) {
        try {

            const id = req.params.id;

            const existUser = await User.findById(id)

            if (!existUser) {
                return res.status(400).json({
                    success: false,
                    message: "User not exist",
                });
            }

            const updateuser = await User.findByIdAndUpdate(id, req.body, { new: true })

            if (updateuser) {
                return res.status(201).json({
                    success: true,
                    message: 'User status updated successfully',
                    data: updateuser
                });
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}



module.exports = new UserController();
