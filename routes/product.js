const express = require('express');

const isAuth = require('../middlewares/isAuth');
const {
  getProducts,
  getWishListProducts,
  addWishList,
} = require('../controllers/product');

const router = express.Router();

router.get('/', getProducts);
router.get('/wishlist', isAuth, getWishListProducts);
router.patch('/wishlist/add', isAuth, addWishList);

module.exports = router;
