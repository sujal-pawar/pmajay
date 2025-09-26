const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

module.exports = {
  generateToken
};
