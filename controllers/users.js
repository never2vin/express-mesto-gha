const User = require('../models/user');
const bcrypt = require('bcrypt');

const statusCodes = require('../utils/constants').HTTP_STATUS;

const SALT_ROUNDS = 10;

const getUsers = (req, res) => User.find({})
  .then((users) => {
    res.status(statusCodes.OK).send(users);
  })
  .catch(() => res.status(statusCodes.INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка'));

const getUserById = (req, res) => User.findById(req.params.id)
  .orFail(new Error('NotFoundError'))
  .then((user) => {
    res.status(statusCodes.OK).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(statusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(statusCodes.NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
  });

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then(({ _id, email }) => res.status(statusCodes.OK).send({ _id, email }))
    .catch((error) => {
      console.log('error:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
        });
      }

      return res.status(500).send('На сервере произошла ошибка');
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
      return res.status(statusCodes.BAD_REQUEST).send({
        message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
      });
    }

    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send('На сервере произошла ошибка');
  });

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
