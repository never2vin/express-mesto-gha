const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
} = require('../controllers/users');
const {
  validateUserId,
  validateUserUpdate,
  validateUserUpdateAvatar,
} = require('../middlewares/request-validator');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateUserUpdateAvatar, updateUser);

module.exports = router;
