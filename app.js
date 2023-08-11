const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/user');

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
})
  .then(() => { console.log('Connected to db'); })
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.get('/users', (req, res) => User.find()
  .then((users) => {
    res.status(200).send(users);
  })
  .catch(() => res.status(500).send('Server Error')));

app.get('/users/:id', (req, res) => User.findById(req.params.id)
  .orFail(new Error('NotFoundError'))
  .then((user) => {
    res.status(201).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.status(500).send('Server Error');
  }));

app.post('/users', (req, res) => User.create({ ...req.body })
  .then((user) => {
    res.status(201).send(user);
  })
  .catch((error) => {
    console.log(error.name);

    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
      });
    }

    return res.status(500).send('Server Error');
  }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
