import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generate = payload => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

const verify = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  };
};

export { generate, verify };