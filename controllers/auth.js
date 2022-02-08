const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const validator = require('../utils/validator');
const validationSchema = require('../utils/validator/schema');

// signup controller
exports.signUp = async (req, res) => {
  try {
    // validate inputs
    const { value, errors } = validator(req.body, validationSchema.signUp);

    if (errors) {
      return res.status(400).send({ success: false, errors });
    }

    // hashing password
    value.password = await bcrypt.hash(value.password, 10);
    const { name, password, email, phoneNumber } = value;
    const user = await User.create({
      name,
      password,
      email,
      phoneNumber,
    });
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return res.status(201).json({ success: true, user, accessToken });
  } catch (error) {
    // duplicate email error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, errors: { message: 'Email already exists!' } });
    }

    return res
      .status(500)
      .json({ success: false, errors: { message: 'Server error.' } });
  }
};
