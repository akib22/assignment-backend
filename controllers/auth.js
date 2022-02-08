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

// signin controller
exports.signIn = async (req, res) => {
  try {
    // validate inputs
    const { value, errors } = validator(req.body, validationSchema.signIn);

    if (errors) {
      return res.status(400).send({ success: false, errors });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, errors: { message: 'User not found.' } });
    }

    // match password
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).send({
        success: false,
        errors: { message: 'Email and password did not match.' },
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, errors: { message: 'Server error.' } });
  }
};
