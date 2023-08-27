const router = require('express').Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');

const statusCodes = require('../utils/constants').HTTP_STATUS;

router.use('/', authRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res) => {
  res
    .status(statusCodes.NOT_FOUND)
    .json({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
