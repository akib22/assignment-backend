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

describe('DELETE /api/products/wishlist/remove', () => {
  afterEach(() => jest.clearAllMocks());

  test('should get unauthorized error message when jwt is invalid or not given', async () => {
    const response = await request(app).delete('/api/products/wishlist/remove');

    expect(response.status).toBe(401);
  });

  test('should return error when data is invalid', async () => {
    const response = await request(app)
      .delete('/api/products/wishlist/remove')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('productId');
  });

  test('should add product to wishlist when data is valid', async () => {
    findByIdAndUpdateSpy.mockReturnValue({});
    const response = await request(app)
      .delete('/api/products/wishlist/remove')
      .send({ productId: Types.ObjectId() })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });
});
