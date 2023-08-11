const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUser);

module.exports = router;
