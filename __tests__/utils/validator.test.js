const validator = require('../../utils/validator');
const schema = require('../../utils/validator/schema');

describe('Validator', () => {
  test('should return error messages when data is invalid', async () => {
    const { value, errors } = validator({ email: 'test' }, schema.signIn);

    expect(value).toBeNull();
    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('password');
  });

  test('should return value when data is valid', async () => {
    const data = { email: 'test@gmail.com', password: '123456' };
    const { value, errors } = validator(data, schema.signIn);

    expect(errors).toBeNull();
    expect(value).toMatchObject(data);
  });
});
