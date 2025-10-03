import User from '../../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../../errors/index.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const jwksClientInstance = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  timeout: 30000, // 30 seconds
});

async function getKey(kid) {
  return new Promise((resolve, reject) => {
    jwksClientInstance.getSigningKey(kid, (err, key) => {
      if (err) return reject(err);
      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
}

export const signInWithOauth = async (req, res) => {
  const { id_token, provider } = req.body;
  if (!id_token || !provider || !['google', 'apple'].includes(provider)) {
    throw new BadRequestError('Invalid request');
  }

  try {
    let email, user;

    if (provider === 'apple') {
      const { header } = jwt.decode(id_token, { complete: true });
      const kid = header.kid;
      const publicKey = await getKey(kid);
      ({ email } = jwt.verify(id_token, publicKey));
    }

    if (provider === 'google') {
      const ticket = await googleClient.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
    }

    user = await User.findOneAndUpdate(
      { email },
      { email_verified: true },
      { new: true, upsert: true }
    );

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    let phone_exist = false;
    let login_pin_exist = false;

    if (user.phone) phone_exist = true;
    if (user.login_pin) login_pin_exist = true;

    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        name: user.name,
        userId: user.id,
        phone_exist,
        login_pin_exist,
      },
      tokens: { access_token: accessToken, refresh_token: refreshToken },
    });
  } catch (error) {
    throw new UnauthenticatedError('Invalid OAuth token');
  }
};
