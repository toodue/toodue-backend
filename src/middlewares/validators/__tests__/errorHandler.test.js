const validationErrorHandler = require('../errorHandler');
const expressValidator = require('express-validator');
const sinon = require('sinon');

describe('validation error handler middleware', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return status 422 and errors if there are any', () => {
    const validationResultStub = sinon.stub(expressValidator, 'validationResult');
    const errors = {
      isEmpty: () => false,
      array: () => [
        {
          param: 'error1_param',
          msg: 'error1_msg',
        },
        {
          param: 'error2_param',
          msg: 'error2_msg',
        }
      ],
    };
    validationResultStub.returns(errors);

    const errorResponse = {
      error: {
        error1_param: 'error1_msg',
        error2_param: 'error2_msg',
      }
    };

    const jsonSpy = sinon.spy();
    const statusStub = sinon.stub();
    statusStub.returns({ json: jsonSpy });

    const res = { status: statusStub };

    validationErrorHandler(null, res, null);

    expect(statusStub.calledOnceWith(422)).toBeTruthy();
    expect(jsonSpy.calledOnceWith(errorResponse)).toBeTruthy();
  });

  it('should continue to callback if there are no errors', () => {
    const errors = {
      isEmpty: () => true
    };
    const validationResultStub = sinon.stub(expressValidator, 'validationResult');
    validationResultStub.returns(errors);
    const callback = sinon.spy();

    validationErrorHandler(null, null, callback);

    expect(callback.calledOnceWith()).toBeTruthy();
  });
});
