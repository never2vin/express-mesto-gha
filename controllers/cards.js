const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .populate('owner')
  .populate('likes')
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch(() => res.status(500).send('На сервере произошла ошибка'));

const createCard = (req, res) => Card.create({ owner: req.user._id, ...req.body })
  .then((card) => {
    res.status(201).send(card);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: `${Object.values(error.errors).map((err) => err.message).join(', ')}`,
      });
    }

    return res.status(500).send('На сервере произошла ошибка');
  });

const deleteCard = (req, res) => Card.findByIdAndDelete(req.params.cardId)
  .orFail(new Error('NotFoundError'))
  .then(() => {
    res.status(200).send({ message: 'Карточка удалена' });
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(500).send('На сервере произошла ошибка');
  });

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotFoundError'))
  .populate('likes')
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(500).send('На сервере произошла ошибка');
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotFoundError'))
  .then((user) => {
    res.status(200).send(user);
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(500).send('На сервере произошла ошибка');
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
