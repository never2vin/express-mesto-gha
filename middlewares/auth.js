const jwt = require('jsonwebtoken');

const statusCodes = require('../utils/constants').HTTP_STATUS;

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .send({ message: 'Пользователь не авторизован' });
  }

  // Выполнить требование правила Eslint "consistent-return".
  return null;
};

module.exports = auth;
