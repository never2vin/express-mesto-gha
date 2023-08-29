const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }
};

module.exports = auth;
