module.exports = (req, res, next) => {
  if ((req.isAuthenticated && req.isAuthenticated()) || req.session.user)
    return next();
  return res.json({
    success: false,
    status: 401,
    message: "Unauthorized",
    data: null,
  });
};