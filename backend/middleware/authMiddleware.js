const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: '❌ Access Denied. No Token Provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded; // 🔥 Attach user data to request
    next();
  } catch (error) {
    res.status(400).json({ message: '❌ Invalid Token' });
  }
};

module.exports = verifyToken;
