const role = (...roles) => {
  return (req, res, next) => {
    try {
      
      if (!roles.includes(req.admin.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorize for This Operation",
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = role;