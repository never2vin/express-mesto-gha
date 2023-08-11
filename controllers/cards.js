const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .populate('owner')
  .then((cards) => {
    res.status(200).send(cards);
  })
  .catch(() => res.status(500).send('Server Error'));

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

    return res.status(500).send('Server Error');
  });

const deleteCardById = (req, res) => Card.findByIdAndDelete(req.params.id)
  .orFail(new Error('NotFoundError'))
  .then(() => {
    res.status(201).send({ message: 'Карточка удалена' });
  })
  .catch((error) => {
    console.log(error);

    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }

    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.status(500).send('Server Error');
  });

module.exports = {
  getCards,
  createCard,
  deleteCardById,
};
