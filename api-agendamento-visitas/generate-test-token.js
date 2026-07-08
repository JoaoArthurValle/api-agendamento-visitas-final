const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = {
  sub: 1,
  email: 'test@example.com',
  role: 'USER'
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1y' });
console.log(token);
