const _bind = require('lodash/bind');
const mongoose = require('mongoose');
const User = require('../../models/user');
const userSchema = require('../../models/user/userSchema');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

describe('user model', () => {
  beforeEach(() => {
    const user = new User({ name: 'test', email: 'test@test.com', password: 'pass123' });
    return user.save();
  });

  afterEach(() => {
    sinon.restore();
    return User.deleteMany({});
  });

  describe('hashPassword middleware', () => {

    it('should not hash again on updates that exclude password', async (done) => {
      const user = await User.findOne({ email: 'test@test.com' });
      user.name = 'new test';
        
      const boundHashPassword = _bind(userSchema._middlewares.hashPassword, user);

      const spyGenSalt = sinon.spy(bcrypt, "genSalt");
      const spyHash = sinon.spy(bcrypt, "hash"); 

      expect.assertions(3);
      const callback = (err) => {
        expect(err).toBeUndefined();
        expect(spyGenSalt.notCalled).toBeTruthy();
        expect(spyHash.notCalled).toBeTruthy();
        done();
      };

      boundHashPassword(callback);
    });

    it('should hash on password updates', async (done) => {
      const user = await User.findOne({ email: 'test@test.com' });
      user.password = 'new password';
          
      const boundHashPassword = _bind(userSchema._middlewares.hashPassword, user);

      expect.assertions(2);
      const callback = (err) => {
        expect(err).toBeUndefined();
        expect(bcrypt.compareSync('new password', user.password)).toBeTruthy();
        done();
      };

      boundHashPassword(callback);
    });

    it('should raise error on salt generation error', async (done) => {
      const user = await User.findOne({ email: 'test@test.com' });
      user.password = 'new password';

      const boundHashPassword = _bind(userSchema._middlewares.hashPassword, user);
      const genSaltStub = sinon.stub(bcrypt, 'genSalt');
      const hashSpy = sinon.spy(bcrypt, 'hash');
      genSaltStub.yields('salt gen err', null);

      expect.assertions(3)
      const callback = (err) => {
        expect(err).toEqual('salt gen err');
        expect(genSaltStub.called).toBeTruthy();
        expect(hashSpy.notCalled).toBeTruthy();
        done();
      };

      boundHashPassword(callback);
    });

    it('should raise error on hashing error', async (done) => {
      const user = await User.findOne({ email: 'test@test.com' });
      user.password = 'new password';

      const boundHashPassword = _bind(userSchema._middlewares.hashPassword, user);
      const hashStub = sinon.stub(bcrypt, 'hash');
      hashStub.yields('hashing err', null);

      expect.assertions(2)
      const callback = (err) => {
        expect(err).toEqual('hashing err');
        expect(hashStub.called).toBeTruthy();
        done();
      };

      boundHashPassword(callback);
    });
  });

  describe('compare password', () => {
    it('should raise error on comparison error', async (done) => {
      const user = await User.findOne({ email: 'test@test.com' });

      const compareStub = sinon.stub(bcrypt, 'compare');
      compareStub.yields('comparison err');

      expect.assertions(1);
      const callback = (err) => {
        expect(err).toEqual('comparison err');
        done();
      };

      user.comparePassword('pass', callback);
    });

    it.each([
      ['pass123', true],
      ['wrong', false],
    ])
    ('should correctly check password', async (pass, result, done) => {
      const user = await User.findOne({ email: 'test@test.com' });

      expect.assertions(2);
      const callback = (err, isMatch) => {
        expect(err).toBeNull();
        expect(isMatch).toEqual(result);
        done();
      };

      user.comparePassword(pass, callback);
    });
  });
});
