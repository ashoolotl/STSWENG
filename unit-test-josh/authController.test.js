const sinon = require('sinon');
const authController = require('../controllers/authController');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

describe('AuthController - Login', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  // To fix
  it('should return 400 if email or password is missing', async () => {
    const { expect } = await import('chai');
    const req = { body: { email: '', password: '' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await authController.login(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: "Please provide email and password" })).to.be.true;
  });
  // to fix
  it('should return 401 if email or password is incorrect', async () => {
    const { expect } = await import('chai');
    const req = { body: { email: 'wrong@gmail.com', password: 'wrongpassword' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    const findOneStub = sandbox.stub(User, 'findOne').resolves(null);

    await authController.login(req, res);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Incorrect email or password" })).to.be.true;
  });

  it('should return 200 and login the user successfully', async () => {
    const { expect } = await import('chai');
    const req = { body: { email: 'test@gmail.com', password: 'hashedpassword' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    const user = { id: 1, 
        email: 'test@gmail.com', 
        password: 'hashedpassword', 
        correctPassword: sinon.stub().resolves(true) };
    sandbox.stub(User, 'findOne').resolves(user);

    await authController.login(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(sinon.match.has('token'))).to.be.true;
  });
});