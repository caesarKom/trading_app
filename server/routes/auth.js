import express from 'express';
import { authenticateUser } from '../middleware/authentication.js';
import { checkEmail } from '../controlers/auth/email.js';
import { signInWithOauth } from '../controlers/auth/oauth.js';
import { sendOtp, verifyOtp } from '../controlers/auth/Otp.js';
import {
  login,
  logout,
  refreshToken,
  register,
} from '../controlers/auth/auth.js';
import {
  getProfile,
  setLoginPinFirst,
  updateProfile,
  verifyPin,
} from '../controlers/auth/user.js';
import {
  uploadBiometrics,
  verifyBiometrics,
} from '../controlers/auth/biometrics.js';

const router = express.Router();

router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateUser, logout);
router.post('/register', register);
router.post('/login', login);

router.post('/check-email', checkEmail);
router.post('/oauth', signInWithOauth);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);

router
  .route('/profile')
  .get(authenticateUser, getProfile)
  .put(authenticateUser, updateProfile);

router.post('/set-pin', authenticateUser, setLoginPinFirst);
router.post('/verify-pin', authenticateUser, verifyPin);
router.post('/upload-biometric', authenticateUser, uploadBiometrics);
router.post('/verify-biometric', authenticateUser, verifyBiometrics);

export default router;
