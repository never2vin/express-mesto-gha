const User = require('../models/user');

const statusCodes = require('../utils/constants').HTTP_STATUS;

const BadRequestError = require('../errors/bad-request-error');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');

const getUsers = (req, res, next) => User.find({})
  .then((users) => {
    res.status(statusCodes.OK).send(users);
  })
  .catch(next);

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    res.status(statusCodes.OK).send(user);
  })
  .catch(next);

const getUserById = (req, res, next) => User.findById(req.params.userId)
  .orFail()
  .then((user) => {
    res.status(statusCodes.OK).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }

    if (error.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    next(error);
  });

const updateUser = (req, res, next) => User.findByIdAndUpdate(
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
      next(new ValidationError(`${Object.values(error.errors).map((err) => err.message).join(', ')}`));
      return;
    }

    next(error);
  });

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUser,
};
