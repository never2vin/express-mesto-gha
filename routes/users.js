const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

module.exports = router;
