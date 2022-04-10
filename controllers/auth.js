const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, res, next) => {
  /**
   * Getting token and check if
   * it's there
   */
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // extract token string only, ignore the word 'Bearer'
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError("Unauthorized, please provide token to gain accesss", 401),
    );

  next();
});
