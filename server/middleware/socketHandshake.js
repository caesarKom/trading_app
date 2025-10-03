import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import User from '../models/User.js';

const socketHandshake = async (socket, next) => {
  try {
    const token = socket.handshake.headers.access_token;

    if (!token) {
      throw new UnauthenticatedError('Authentication Invalid not token');
    }

    const decoded = jwt.verify(token, process.env.SOCKET_TOKEN_SECRET);
    if (!decoded) {
      throw new UnauthenticatedError('Invalid token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthenticatedError('User not found');
    }

    socket.user = user;

    next();
  } catch (error) {
    console.log('Socket authentication error: ' + error.message);
    next(new UnauthenticatedError('Authentication error'));
  }
};

export default socketHandshake;
