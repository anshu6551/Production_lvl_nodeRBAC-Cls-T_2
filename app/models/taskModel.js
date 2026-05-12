const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    dueDate: {
        type: Date,
       
    },
    attachments: {
        type: String 
    },
    cloudinaryid: {
        type : String
    },
    isDeleted: {
        type : Boolean,
        default: false
    },
   
}, {
    timestamps: true,
    versionKey: false
})


const taskModel = mongoose.model('task', taskSchema);

module.exports = taskModel