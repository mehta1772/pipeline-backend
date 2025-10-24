// backend/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
  if (req.session && req.session.userId) {
    // User is logged in
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
};

module.exports = authMiddleware;