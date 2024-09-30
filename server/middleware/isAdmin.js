module.exports = async (req, res, next) => {
  try {
    if (!req.user.user.isAdmin) {
      return res.json({
        success: false,
        status: 403,
        message: "Only accessible to admins",
        data: null,
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      status: 500,
      message: "Server error",
      data: null,
    });
  }
};