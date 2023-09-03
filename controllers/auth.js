const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const statusCodes = require('../utils/constants').HTTP_STATUS;

const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;
const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then(({ _id, email }) => res.status(statusCodes.CREATED).send({ _id, email }))
    .catch((error) => {
      console.log('error:', error);

      if (error.code === MONGO_DUPLICATE_KEY_ERROR) {
        next(new ConflictError('Такой пользователь уже есть'));
        return;
      }

      if (error.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
        return;
      }

      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail()
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new Error('UnauthorizedError');
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(statusCodes.OK).send({ token });
    })
    .catch((error) => {
      console.log('error:', error);

      if (error.name === 'DocumentNotFoundError' || error.message === 'UnauthorizedError') {
        next(new UnauthorizedError('Email или пароль неверный'));
        return;
      }

      next(error);
    });
};

module.exports = {
  createUser,
  login,
};
