const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const User = require('../../models/User');

const findByIdAndUpdateSpy = jest.spyOn(User, 'findByIdAndUpdate');
const token = jwt.sign(
  { id: Types.ObjectId() },
  process.env.JWT_SECRET || 'test_secret'
);

describe('POST /api/user/signup', () => {
  afterEach(() => jest.clearAllMocks());

  test('should return error when data is invalid', async () => {
    const response = await request(app)
      .patch('/api/products/wishlist/add')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('productId');
  });

  test('should add product to wishlist when data is valid', async () => {
    findByIdAndUpdateSpy.mockReturnValue({});
    const response = await request(app)
      .patch('/api/products/wishlist/add')
      .send({ productId: Types.ObjectId() })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
  });
});
