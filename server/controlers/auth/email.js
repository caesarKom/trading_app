import User from '../../models/User.js';
import OTP from '../../models/Otp.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../errors/index.js';
import { generateOTP } from '../../services/mailSender.js';

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  let isExist = true;
  let user = await User.findOne({ email });

  if (!user) {
    const otp = await generateOTP();
    await OTP.create({ email, otp, otp_type: 'email' });
    isExist = false;
  }

  res.status(StatusCodes.OK).json({ isExist });
};
