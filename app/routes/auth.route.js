const express = require('express');

const router = express.Router();

const AuthController = require('../controller/authController');

const AdminAuthCheck = require('../middleware/AdminAuthCheck');
const RoleAuthCheck = require('../middleware/roleAuthCheck')

const AdminImage = require('../utils/cloudinary');


router.post('/register', AdminImage.single('avatar'), AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AdminAuthCheck, RoleAuthCheck('admin'), AuthController.logout);


module.exports = router;