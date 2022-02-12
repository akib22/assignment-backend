const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const pageNotFound = require('./middlewares/404');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('App is running!');
});

// auth routes
app.use('/api/user', authRoutes);

// products routes
app.use('/api/products', productRoutes);

// page not found or 404 middleware
app.use(pageNotFound);

async function createDBConnection() {
  try {
    if (process.env.NODE_ENV !== 'TEST') {
      await mongoose.connect(process.env.MONGODB_URL);
    }

    app.listen(process.env.PORT || 5000, () =>
      console.log(`app running on port ${process.env.PORT}!`)
    );
  } catch (error) {
    console.log(error, 'Database connection failed.');
  }
}

createDBConnection();

module.exports = app; // for testing
