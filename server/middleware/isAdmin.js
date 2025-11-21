// Middleware to check if authenticated user is admin
module.exports = function isAdmin(req, res, next) {
  // Expect req.user to be set by auth middleware
  if (!req.user) {
    return res.status(401).json({ msg: 'Not authenticated' });
  }

  if (req.user.role && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
};
