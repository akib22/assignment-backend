const Product = require('../models/Product');

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
