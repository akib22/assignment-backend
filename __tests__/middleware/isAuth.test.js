const jwt = require('jsonwebtoken');

const isAuth = require('../../middlewares/isAuth');

describe('isAuth middleware', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = (authHeader, sessionData) => ({
    get(name) {
      if (name === 'Authorization') return authHeader;
      return null;
    },
    session: { data: sessionData },
  });

  const expectedErrorResponse = {
    message: 'you are not authenticate',
    success: false,
  };

  const nextFunction = jest.fn();

  test('should give error message when invalid token send', async () => {
    const res = mockResponse();
    const req = mockRequest();
    await isAuth(req, res, nextFunction);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith(expectedErrorResponse);
  });

  test('should bind "userId" in req object when valid token send', async () => {
    const token = jwt.sign({ id: '123456' }, 'test_secret');
    const res = mockResponse();
    const req = mockRequest(`Bearer ${token}`);
    await isAuth(req, res, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
    expect(req).toHaveProperty('userId');
  });
});
