const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/auth');

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}, { abortEarly: false });

router.post('/signin', validateUser, login);
router.post('/signup', validateUser, createUser);

module.exports = router;
