/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { Types } = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = require('../../app');
const User = require('../../models/User');

const createSpy = jest.spyOn(User, 'create');
const findOneSpy = jest.spyOn(User, 'findOne');
const jwtSignSpy = jest.spyOn(jwt, 'sign');
const hashSpy = jest.spyOn(bcrypt, 'hash');
const reqBody = {
  name: 'test user',
  email: 'testingwithjest@gmail.com',
  password: '123456',
  phoneNumber: '1234567890',
};

describe('POST /api/user/signup', () => {
  afterEach(() => jest.clearAllMocks());

  test('should send errors message when payload is not valid', async () => {
    const bodies = [
      {},
      { name: 'test user' },
      { name: 'test user', email: 'test@gmail.com' },
    ];

    for (const body of bodies) {
      const response = await request(app).post('/api/user/signup').send(body);

      expect(Object.keys(response.body.errors)).toBeTruthy();
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
      expect(response.statusCode).toBe(400);
    }
  });

  test('should create a new user when request body is valid', async () => {
    createSpy.mockReturnValue(
      Promise.resolve({ ...reqBody, id: Types.ObjectId() })
    );
    findOneSpy.mockReturnValue(Promise.resolve(null));

    const response = await request(app).post('/api/user/signup').send(reqBody);
    const { body, statusCode } = response;

    // checking findOne function call
    expect(findOneSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledWith({ email: reqBody.email });

    // checking bcryptjs hash function call
    expect(hashSpy).toBeCalledTimes(1);
    expect(hashSpy).toBeCalledWith(reqBody.password, 10);

    // checking create function call
    expect(createSpy).toBeCalledTimes(1);
    expect(createSpy).toBeCalledWith(reqBody);
    expect(jwtSignSpy).toBeCalledWith(
      { id: Types.ObjectId(body.user.id) },
      process.env.JWT_SECRET
    );

    // checking response body
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe(reqBody.email);
    expect(statusCode).toBe(201);
  });

  test('should not create a new user when email already exists', async () => {
    findOneSpy.mockReturnValue(Promise.resolve({}));

    const response = await request(app).post('/api/user/signup').send(reqBody);
    const { body, statusCode } = response;

    // checking findOne function call
    expect(findOneSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledWith({ email: reqBody.email });

    // checking create function call
    expect(createSpy).toBeCalledTimes(0);

    // checking response body
    expect(body).toHaveProperty('errors');
    expect(body.errors).toHaveProperty('message');
    expect(statusCode).toBe(400);
  });
});
