const validator = (data, schema) => {
  const { value, error } = schema.validate(data);
  const errors = {};

  if (error) {
    // normalize joi error message
    error.details.forEach((item) => {
      errors[item.path[0]] = item.message;
    });

    return { errors, value: null };
  }

  return { error: null, value };
};

module.exports = validator;
