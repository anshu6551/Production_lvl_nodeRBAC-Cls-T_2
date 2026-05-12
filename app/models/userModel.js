const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        
    },
    role :{
        type : String,
        enum : ["employee", "admin", "manager"],
        default : "employee"
    },
    phone: {
        type : String,
        required : true,
       
    },
    avatar: {
        type : String,
        default : "https://ambraee.com/cdn/shop/files/JBL07574.jpg?v=1736702438&width=1080"
    },
    cloudinaryid: {
        type : String
    },
    status: {
        type: String,
        enum: ['Activate', 'Deactivate'],
        default: 'Activate'
    },
    isDeleted: {
        type : Boolean,
        default: false
    },
    
}, {
    timestamps: true,
    versionKey: false
});


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;