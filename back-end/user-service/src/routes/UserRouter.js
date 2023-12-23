const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
const { authMiddleWareAdmin, authMiddleWareUser,authMiddleWareToken } = require("../middleware/authMiddleware");

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out',authMiddleWareToken, userController.logoutUser)
router.put('/updatePassword',authMiddleWareToken, userController.updatePassword)
router.get('/get-detail-user/:id', authMiddleWareUser, userController.getDetailsUser)
router.put('/update-user/:id',authMiddleWareUser, userController.updateUser)
router.delete('/delete-user/:id', authMiddleWareAdmin, userController.deleteUser)
router.get('/get-all-user', userController.getAllUser)
router.get('/get-all-user-search', authMiddleWareAdmin, userController.getAllUserSearch)
router.delete('/delete-many-user', authMiddleWareAdmin, userController.deleteMany)
router.get('/export', authMiddleWareAdmin, userController.exportExcel)





module.exports = router