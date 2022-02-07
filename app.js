const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('App is running!');
});

app.listen(process.env.PORT, () =>
  console.log(`app running on port ${process.env.PORT}!`)
);
