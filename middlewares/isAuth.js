const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: 'you are not authenticate' });
  }

  // extract token from Bearer
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
  } catch (err) {
    return res.status(401).json({ success: false, err });
  }

  if (!decodedToken) {
    return res
      .status(401)
      .json({ success: false, message: 'you are not authenticate' });
  }

  req.userId = decodedToken.id;
  next();
};
