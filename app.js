const express = require('express');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
