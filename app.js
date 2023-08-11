const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
})
  .then(() => { console.log('Connected to db'); })
  .catch((err) => console.log(err));

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
