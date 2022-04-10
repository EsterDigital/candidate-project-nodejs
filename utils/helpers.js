const { validationResult } = require('express-validator');

const filterObj = (obj, ...notAllowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!notAllowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: errors.array()
    });
      
  };
};

module.exports = {
  filterObj,
  validate
}