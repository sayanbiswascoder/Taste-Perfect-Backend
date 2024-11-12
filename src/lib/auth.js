import bcrypt from 'bcrypt';

const saltRounds = 10;

// Hash the password
const hashPassword = async(password) => {
  return await bcrypt.hash(password, saltRounds);
}

// Verify the password
const verifyPassword = async(password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}

export { hashPassword, verifyPassword };
