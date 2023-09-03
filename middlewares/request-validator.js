const { celebrate, Joi } = require('celebrate');

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: /https?/ }).messages({
      'string.uriCustomScheme': '{#label} must be a valid link',
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}, { abortEarly: false });

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}, { abortEarly: false });

const validateUserUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: /https?/ }).messages({
      'string.uriCustomScheme': '{#label} must be a valid link',
    }),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: /https?/ }).messages({
      'string.uriCustomScheme': '{#label} must be a valid link',
    }),
  }),
}, { abortEarly: false });

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});

module.exports = {
  validateUser,
  validateUserId,
  validateUserUpdate,
  validateUserUpdateAvatar,
  validateCard,
  validateCardId,
};
