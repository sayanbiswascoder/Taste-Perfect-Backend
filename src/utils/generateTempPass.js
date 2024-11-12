import crypto from 'crypto';

export function generateTempPassword() {
  return crypto.randomBytes(8).toString('hex');
}