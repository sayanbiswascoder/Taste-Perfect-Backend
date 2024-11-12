import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

// Generate JWT
export function generateToken(userId) {
  return jwt.sign({ userId }, secretKey, { expiresIn: '365d' });
}

// Verify JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}
