const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const statusCodes = require('../utils/constants').HTTP_STATUS;

const SALT_ROUNDS = 10;
const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const getUsers = (req, res) => User.find({})
  .then((users) => {
    res.status(statusCodes.OK).send(users);
  })
  .catch(() => res
    .status(statusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' }));

const getUserById = (req, res) => User.findById(req.params.id)
  .orFail(new Error('NotFoundError'))
  .then((user) => {
    res.status(statusCodes.OK).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res
        .status(statusCodes.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res
        .status(statusCodes.NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }

    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  });

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then(({ _id, email }) => res.status(statusCodes.OK).send({ _id, email }))
    .catch((error) => {
      console.log('error:', error);

      if (error.name === 'ValidationError') {
        return res
          .status(statusCodes.BAD_REQUEST)
          .send({
            message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
          });
      }

      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  req.body,
  { new: true, runValidators: true },
)
  .then((user) => {
    res.status(statusCodes.OK).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'ValidationError') {
      return res
        .status(statusCodes.BAD_REQUEST)
        .send({
          message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
        });
    }

    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  });

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .send({ message: 'Email или пароль не могут быть пустыми' });
  }

  User.findOne({ email })
    .orFail(new Error('NotFoundError'))
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new Error('UnauthorizedError');
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(statusCodes.OK).send({ token });
    })
    .catch((error) => {
      console.log('error:', error);

      if (error.message === 'NotFoundError' || error.message === 'UnauthorizedError') {
        return res
          .status(statusCodes.UNAUTHORIZED)
          .send({ message: 'Email или пароль неверный' });
      }

      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });

  // Выполнить требование правила Eslint "consistent-return".
  return null;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  login,
};
