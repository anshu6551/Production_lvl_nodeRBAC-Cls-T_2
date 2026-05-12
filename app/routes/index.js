const express = require('express');


const router = express.Router();


const AuthApi = require('./auth.route');
const UserApi = require('./userRoute');
const TaskApi = require('./taskRoute');



// Auth Api

router.use('/api/auth', AuthApi);


// user api

router.use('/api/users', UserApi);


// task api

router.use('/api/tasks', TaskApi);




module.exports = router;