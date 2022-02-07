const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('App is running!');
});

async function createDBConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    app.listen(process.env.PORT, () =>
      console.log(`app running on port ${process.env.PORT}!`)
    );
  } catch (error) {
    console.log(error, 'Database connection failed.');
  }
}

createDBConnection();
