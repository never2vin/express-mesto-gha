const router = require('express').Router();
const { createUser, login } = require('../controllers/auth');
const { validateUser } = require('../middlewares/request-validator');

router.post('/signin', validateUser, login);
router.post('/signup', validateUser, createUser);

module.exports = router;
