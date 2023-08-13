const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res.status(404).json({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
