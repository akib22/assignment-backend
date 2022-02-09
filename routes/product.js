const express = require('express');

const isAuth = require('../middlewares/isAuth');
const { getProducts, getWishListProducts } = require('../controllers/product');

const router = express.Router();

router.get('/', getProducts);
router.get('/wishlist', isAuth, getWishListProducts);

module.exports = router;
