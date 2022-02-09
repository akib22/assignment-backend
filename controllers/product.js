const { Types } = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');
const validator = require('../utils/validator');
const validationSchema = require('../utils/validator/schema');

/**
 * @controller get products
 * @desc find all products from database then return them.
 * @return [{products}]
 */
exports.getProducts = async (req, res) => {
  try {
    let { limit, page } = req.query;
    limit = limit || 8;
    page = page || 1;
    const skip = limit * (page - 1);

    // TODO: replace this with aggregate query
    const [products, count] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.find().count(),
    ]);

    res.status(200).json({ success: true, products, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: { message: 'Server error' } });
  }
};

/**
 * @controller get wishlist products
 * @desc find all products from database then return them.
 * @return [{products}]
 */
exports.getWishListProducts = async (req, res) => {
  try {
    let { limit, page } = req.query;
    limit = limit || 8;
    page = page || 1;
    const skip = limit * (page - 1);

    const user = await User.findById(req.userId).populate({
      path: 'wishlists',
      options: {
        limit,
        skip,
      },
    });

    res.status(200).json({ success: true, products: user.wishlists });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: { message: 'Server error' } });
  }
};

// add wishlist product
exports.addWishList = async (req, res) => {
  try {
    // validate inputs
    const { value, errors } = validator(req.body, validationSchema.wishList);

    if (errors) {
      return res.status(400).send({ success: false, errors });
    }

    const { productId } = value;
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { wishlists: Types.ObjectId(productId) },
    });

    res.status(201).json({ success: true, message: 'Successfully added.' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: { message: 'Server error' } });
  }
};

// remove wishlist product
exports.removeWishList = async (req, res) => {
  try {
    // validate inputs
    const { value, errors } = validator(req.body, validationSchema.wishList);

    if (errors) {
      return res.status(400).send({ success: false, errors });
    }

    const { productId } = value;
    await User.findByIdAndUpdate(req.userId, {
      $pull: { wishlists: Types.ObjectId(productId) },
    });

    res.status(200).json({ success: true, message: 'Successfully removed.' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: { message: 'Server error' } });
  }
};
