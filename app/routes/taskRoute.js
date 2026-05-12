const express = require('express');
const router = express.Router();
const TaskController = require('../controller/taskController');
const UserAuthCheck = require('../middleware/AdminAuthCheck');
const RoleAuthCheck = require('../middleware/roleAuthCheck');
const TaskImage = require('../utils/cloudinary');

// 1. Search (Static routes hamesha upar)
router.get('/search', UserAuthCheck, TaskController.searchTask);

// 2. Role Specific views
router.get('/owntask', UserAuthCheck, RoleAuthCheck('employee'), TaskController.ownTask);

// 3. General views
router.get('/', UserAuthCheck, RoleAuthCheck('admin', 'manager'), TaskController.alltask);
router.get('/:id', UserAuthCheck, RoleAuthCheck('admin', 'manager', 'employee'), TaskController.taskById);

// 4. Creation (Only Manager)
router.post('/create', UserAuthCheck, RoleAuthCheck('manager'), TaskImage.single('attachments'), TaskController.taskCreate);

// 5. Full Update (Admin/Manager)
router.put('/:id', UserAuthCheck, RoleAuthCheck('admin', 'manager'), TaskImage.single('attachments'), TaskController.taskUpdate);

// 6. Partial Updates (Status/Assignment)
router.patch('/status/:id', UserAuthCheck, RoleAuthCheck('manager', 'employee'), TaskController.updateTaskStatus);
router.patch('/assign/:id', UserAuthCheck, RoleAuthCheck('manager'), TaskController.updateTaskAssign);

// 7. Deletion (Only Admin)
router.delete('/:id', UserAuthCheck, RoleAuthCheck('admin'), TaskController.deleteTask);

module.exports = router;