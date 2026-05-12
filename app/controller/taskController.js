const Task = require('../models/taskModel')
const User = require("../models/userModel");


const fs = require('fs');
const path = require('path')

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

class TaskController {


    async alltask(req, res) {
        try {
            const alltask = await Task.find();

            if (!alltask) {
                return res.status(400).json({
                    success: false,
                    message: "task does not found",
                });
            }


            return res.status(200).json({
                success: true,
                message: "All task gets successfully",
                data: alltask,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async taskById(req, res) {
        try {
            const id = req.params.id;

            const existTask = await Task.findById(id);

            if (!existTask) {
                return res.status(400).json({
                    success: false,
                    message: "Task does not exist",
                });
            }

            if ((req.admin.id == existTask.assignedTo) || (req.admin.role === 'manager')) {
                return res.status(200).json({
                    success: true,
                    message: "Task gets in successfully",
                    data: existTask

                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "This employee is not assign for this task",
                });
            }


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async ownTask(req, res) {
        try {

            const existTask = await Task.find({ assignedTo: req.admin.id });


            if (existTask.length == 0) {
                return res.status(400).json({
                    success: false,
                    message: "No assign task",
                });
            }

            if (existTask) {

                return res.status(200).json({
                    success: true,
                    message: "data get successfully",
                    data: existTask
                });
            }
            

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async taskCreate(req, res) {
        try {

            const { title, description, assignedTo, status, priority, attachments, dueDate } = req.body

            if (!title || !description || !assignedTo || !status || !priority) {

                return res.status(400).json({
                    success: false,
                    message: "All fiels required",
                });
            }


            const assignUser = await User.findById(assignedTo);

            if (!assignUser) {
                return res.status(400).json({
                    success: false,
                    message: "employee does not exist",

                });
            } else {
                if (assignUser.role === 'manager') {
                    const newtask = new Task({
                        title, description, assignedBy: req.admin.id,
                        assignedTo, status, priority, dueDate
                    });

                    if (attachments) {
                        newtask.attachments = req.file.path;
                        newtask.cloudinaryid = req.file.filename;
                    }

                    const result = await newtask.save();

                    if (result) {
                        return res.status(201).json({
                            success: true,
                            message: "Task created successfully",
                            data: result,
                        });
                    }

                } else {
                    return res.status(400).json({
                        success: false,
                        message: "you are not assign task to an employee",

                    });
                }
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async taskUpdate(req, res) {
        try {

            const id = req.params.id;

            const existData = await Task.findById(id);

            if (!existData) {

                return res.status(400).json({
                    success: false,
                    message: "data not found",
                });
            }

            if (req.admin.id == existData.assignedTo) {

                const {
                    title, description, assignedTo, status, priority, attachments, dueDate
                } = req.body;

                if (title || description || assignedTo || priority || dueDate) {
                    return res.status(400).json({
                        success: false,
                        message: 'you can update only status, attachments',
                    });
                }

                if (req.file) {

                    if (existData.attachments) {
                        let deletedImage = await cloudinary.uploader.destroy(existData.cloudinaryid);

                    }

                    existData.image = req.file.path;
                    existData.cloudinaryid = req.file.filename;
                }


                existData.status = status || existData.status;
                existData.attachments = attachments || existData.attachments;

                const updateData = await existData.save();

                if (updateData) {
                    return res.status(201).json({
                        success: true,
                        message: 'data updated successfully',
                        data: updateData
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: 'data not updated',
                });

            }

            if (req.admin.role == 'admin') {

                const {
                    title, description, assignedTo, status, priority, attachments, dueDate
                } = req.body;

                if (req.file) {

                    if (existData.attachments) {
                        let deletedImage = await cloudinary.uploader.destroy(existData.cloudinaryid);

                    }

                    existData.image = req.file.path;
                    existData.cloudinaryid = req.file.filename;
                }

                existData.title = title || existData.title;
                existData.description = description || existData.description;
                existData.assignedTo = assignedTo || existData.assignedTo;
                existData.status = status || existData.status;
                existData.priority = priority || existData.priority;
                existData.dueDate = dueDate || existData.dueDate;
                existData.attachments = attachments || existData.attachments;

                const updateData = await existData.save();

                if (updateData) {
                    return res.status(201).json({
                        success: true,
                        message: 'data updated successfully',
                        data: updateData
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: 'data not updated',
                });

            } else {
                return res.status(400).json({
                    success: false,
                    message: 'you are not assign for this task',
                });
            }


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteTask(req, res) {
        try {

            const id = req.params.id;

            const existdata = await User.findById(id)

            if (!existdata) {
                return res.status(400).json({
                    success: false,
                    message: "data not exist",
                });
            }

            if (existdata.attachments) {
                let deletedImage = await cloudinary.uploader.destroy(
                    existdata.cloudinaryid,
                );
            }

            const deletedata = await User.findByIdAndUpdate(id, { isdelete: true }, { new: true })

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

    async updateTaskStatus(req, res) {
        try {

            const id = req.params.id;

            const existdata = await Task.findById(id)

            if (!existdata) {
                return res.status(400).json({
                    success: false,
                    message: "data not exist",
                });
            }

            const { status } = req.body

            if ((existdata.assignedTo == req.admin.id) || (req.admin.role === 'manager')) {
                const updatedata = await Task.findByIdAndUpdate(id, req.body, { new: true })

                if (updatedata) {
                    return res.status(201).json({
                        success: true,
                        message: 'data status updated successfully',
                        data: updatedata
                    });
                }

            } else {
                return res.status(400).json({
                    success: false,
                    message: "You are not valid employee for this project",
                });
            }


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async updateTaskAssign(req, res) {
        try {

            const id = req.params.id;

            const existdata = await Task.findById(id);

            if (!existdata) {
                return res.status(400).json({
                    success: false,
                    message: "data not exist",
                });
            }

            const { assignedTo } = req.body

            if (!assignedTo) {

                return res.status(400).json({
                    success: false,
                    message: "All field required",
                });
            }


            const assignUser = await User.findById(assignedTo);

            if (!assignUser) {
                return res.status(400).json({
                    success: false,
                    message: "employee not exist",

                });

            } else {
                if (assignUser.role === 'employee') {

                    const updatedata = await Task.findByIdAndUpdate(id, req.body, { new: true })

                    if (updatedata) {
                        return res.status(201).json({
                            success: true,
                            message: 'data assign updated successfully',
                            data: updatedata
                        });
                    }

                } else {
                    return res.status(400).json({
                        success: false,
                        message: "you are not assign task to an employee",

                    });
                }
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async searchTask(req, res) {

        try {

            const { status, priority } = req.query;

            let filter = {};

            if (status) {
                filter.status = {
                    $regex: `^${status}$`,
                    $options: "i"
                };
            }


            if (priority) {
                filter.priority = {
                    $regex: `^${priority}$`,
                    $options: "i"
                };
            }
            const tasks = await Task.find(filter)

            res.status(200).json({
                success: true,
                message: "task gets successfully",
                data: tasks
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };

}


module.exports = new TaskController();
