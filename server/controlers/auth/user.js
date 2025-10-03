import User from '../../models/User.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../../errors/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  const { name, gender, date_of_birth } = req.body;
  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (gender) updatedFields.gender = gender;
  if (date_of_birth) updatedFields.date_of_birth = date_of_birth;

  const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
    new: true,
    runValidators: true,
    select: '-password -biometricKey -login_pin',
  });

  if (!updatedUser) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  res.status(StatusCodes.OK).json({ success: true, data: updatedUser });
};

export const setLoginPinFirst = async (req, res) => {
  const { login_pin } = req.body;

  if (!login_pin || login_pin.length !== 4) {
    throw new BadRequestError('Login pin must be 4 digits');
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }
  if (user.login_pin) {
    throw new NotFoundError(`Login pin already set`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPin = await bcrypt.hash(login_pin, salt);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { login_pin: hashedPin },
    { new: true, runValidators: true }
  );

  const access_token = await jwt.sign(
    { userId: userId },
    process.env.SOCKET_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  const refresh_token = await jwt.sign(
    { userId: userId },
    process.env.REFRESH_SOCKET_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_SOCKET_TOKEN_EXPIRY }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    socket_tokens: {
      socket_access_token: access_token,
      socket_refresh_token: refresh_token,
    },
  });
};

export const verifyPin = async (req, res) => {
  const { login_pin } = req.body;

  if (!login_pin || login_pin.length !== 4) {
    throw new BadRequestError('Login pin must be 4 digits');
  }

  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }
  if (!user.login_pin) {
    throw new NotFoundError(`Login pin not set`);
  }

  const isVerifyingPin = await user.comparePIN(login_pin);

  if (!isVerifyingPin) {
    let message;

    if (user.blocked_until_pin && user.blocked_until_pin > new Date()) {
      const blockedTime = Math.ceil(
        (user.blocked_until_pin - new Date()) / 60000
      );
      message = `Please try again after ${blockedTime} minutes.`;
    } else {
      const attemptsRemaining = 3 - user.wrong_pin_attempts;
      message =
        attemptsRemaining > 0
          ? `Wrong PIN. ${attemptsRemaining} attempts remaining.`
          : 'You have been blocked. Please try again after 30 minutes.';
    }
    throw new UnauthenticatedError(message);
  }

  const access_token = await jwt.sign(
    { userId: userId },
    process.env.SOCKET_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  const refresh_token = await jwt.sign(
    { userId: userId },
    process.env.REFRESH_SOCKET_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_SOCKET_TOKEN_EXPIRY }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    socket_tokens: {
      socket_access_token: access_token,
      socket_refresh_token: refresh_token,
    },
  });
};

export const getProfile = async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userId = decoded.userId;

  const user = await User.findById(userId).select('-password -biometricKey');

  if (!user) {
    throw new NotFoundError(`No user with id : ${userId}`);
  }

  let pinExists = false;
  let phoneExist = false;
  if (user.login_pin) pinExists = true;
  if (user.phone_number) phoneExist = true;

  res.status(StatusCodes.OK).json({
    userId: user.id,
    email: user.email,
    phone_exist: phoneExist,
    name: user.name,
    login_pin_exist: pinExists,
    balance: user.balance.toFixed(2),
  });
};
