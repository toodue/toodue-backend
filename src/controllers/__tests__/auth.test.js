const _ = require('lodash');
const mongoose = require('mongoose');
const sinon = require('sinon');
const supertest = require('supertest');

const app = require('../../app');
const User = require('../../models/user');

const request = supertest(app);

describe("POST /auth/sign_up", () => {

  afterEach(() => {
    sinon.restore();
    return User.remove({});
  });

  describe("field validation", () => {
    const baseBody = {
      email: 'test@test.com',
      name: 'test',
      password: 'pass1234',
    };

    const invalidMailBody = {...baseBody, email: 'test.com'};
    const shortPasswordBody = {...baseBody, password: 'pass'};
    const longPasswordBody = {...baseBody, password: 'y5eoSly7jzP2bHzc3W4XJrYazoAO8t1'};
    const emptyNameBody = _.omit(baseBody, 'name');

    const invalidMailResponse = { error: { email: 'This email is not in a valid format' }};
    const wrongLengthPasswordResponse = { error: { password: 'The password field must have between 8 and 30 characters' }};
    const emptyNameResponse = { error: { name: 'The name field cannot be empty' }};

    it.each([
      [invalidMailBody, invalidMailResponse],
      [shortPasswordBody, wrongLengthPasswordResponse],
      [longPasswordBody, wrongLengthPasswordResponse],
      [emptyNameBody, emptyNameResponse],
    ])
    ('should return 422 on invalid email', async (body, response, done) => {
      request.post('/auth/sign_up')
        .send(body)
        .expect(422)
        .end(async (err, res) => {
          if (err) return done(err);
          try {
            expect(res.body).toMatchObject(response);

            const user = await User.findOne({ email: 'test@test.com' });
            expect(user).toBeNull();

            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });

  it('should return 500 on user saving error', async (done) => {
    const saveStub = sinon.stub(User.prototype, "save");
    saveStub.yields('error saving');
    request.post('/auth/sign_up')
      .send({ name: 'test', email: 'test@test.com', password: 'password' })
      .expect(500)
      .end(async (err, res) => {
        if (err) return done(err);

        expect(res.body).toMatchObject({ error: 'error saving' });

        const user = await User.findOne({ email: 'test@test.com' });
        expect(user).toBeNull();

        done();
      });
  });

  it('should save user to database on right formatted body', async (done) => {
    request.post('/auth/sign_up')
      .send({ name: 'test', email: 'test@test.com', password: 'password' })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);

        expect(res.body).toMatchObject({ user: { email: 'test@test.com', name: 'test' } });

        const user = await User.findOne({ email: 'test@test.com' });
        expect(user).toBeTruthy();
        expect(user.email).toEqual('test@test.com');
        expect(user.name).toEqual('test');

        done();
      });
  });
})
