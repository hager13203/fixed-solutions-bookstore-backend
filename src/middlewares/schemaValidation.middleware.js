const validate = (validateFn) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is required.",
      });
    }

    const valid = validateFn(req.body);

    if (!valid) {
      const errors = validateFn.errors.map((err) => ({
        field: err.instancePath || err.params.missingProperty || "body",
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};

module.exports = validate;
