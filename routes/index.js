const router = require('express').Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const NotFoundError = require('../errors/not-found-error');

router.use('/', authRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

router.use(errorHandler);

module.exports = router;
