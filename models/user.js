const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле \'name\' должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля \'name\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'name\' - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле \'about\' должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля \'about\' - 2'],
    maxlength: [30, 'Максимальная длина поля \'about\' - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле \'avatar\' должно быть заполнено'],
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
