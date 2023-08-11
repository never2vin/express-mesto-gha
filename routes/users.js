const router = require('express').Router();
const User = require('../models/user');

router.get('/users', (req, res) => User.find()
  .then((users) => {
    res.status(200).send(users);
  })
  .catch(() => res.status(500).send('Server Error')));

router.get('/users/:id', (req, res) => User.findById(req.params.id)
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

router.post('/users', (req, res) => User.create({ ...req.body })
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

module.exports = router;
