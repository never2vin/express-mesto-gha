[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)

# Проект Mesto фронтенд + бэкенд

## Обзор

- Ссылка на проект
- Используемые технологии
- Обновления

## Ссылка на проект

[Mesto](https://github.com/never2vin/express-mesto-gha#readme)

## Используемые технологии

- Node.js
- Express
- MongoDB

### Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки  
`/models` — папка с файлами описания схем пользователя и карточки

Остальные директории вспомогательные, создаются при необходимости разработчиком

### Запуск проекта

`npm run start` — запускает сервер  
`npm run dev` — запускает сервер с hot-reload

## Обновления

### Схемы и модели

Поля схемы пользователя:

#### Спринт 13

- name — имя пользователя, строка от 2 до 30 символов, обязательное поле;
- about — информация о пользователе, строка от 2 до 30 символов, обязательное поле;
- avatar — ссылка на аватарку, строка, обязательное поле.

#### Спринт 14

- name — имя пользователя, строка от 2 до 30 символов;
- about — информация о пользователе, строка от 2 до 30 символов;
- avatar — ссылка на аватарку, строка;
- email — уникальное и обязательное поле.
- password — строка, обязательное поле.

Поля схемы карточки:

- name — имя карточки, строка от 2 до 30 символов, обязательное поле;
- link — ссылка на картинку, строка, обязательно поле;
- owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
- likes — список лайкнувших пост пользователей, массив ObjectId, по умолчанию — пустой массив (поле default);
- createdAt — дата создания, тип Date, значение по умолчанию `Date.now`.

### Контроллеры и роуты

Для пользователей:

#### Спринт 13

- GET /users — возвращает всех пользователей
- GET /users/:userId - возвращает пользователя по \_id
- POST /users — создаёт пользователя
- PATCH /users/me — обновляет профиль
- PATCH /users/me/avatar — обновляет аватар

#### Спринт 14

- GET /users — возвращает всех пользователей
- GET /users/:userId - возвращает пользователя по \_id
- GET /users/me — получения информации о пользователе
- POST /signup — регистрация пользователя
- POST /signin — логин пользователя
- PATCH /users/me — обновляет профиль
- PATCH /users/me/avatar — обновляет аватар

Для карточек:

- GET /cards — возвращает все карточки
- POST /cards — создаёт карточку
- DELETE /cards/:cardId — удаляет карточку по идентификатору
- PUT /cards/:cardId/likes — поставить лайк карточке
- DELETE /cards/:cardId/likes — убрать лайк с карточки

### Обработка ошибок

#### Спринт 13

- 400 — переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля;
- 404 — карточка или пользователь не найден.
- 500 — ошибка по-умолчанию.

#### Спринт 14

- 401 — передан неверный логин или пароль
- 403 — попытка удалить чужую карточку
- 409 — при регистрации указан email, который уже существует на сервере

1. Создан мидлвэр для централизованной обработки ошибок.
2. Создан мидлвэр для валидации приходящих на сервер запросов.
3. Данные валидируются на уровне схемы.
