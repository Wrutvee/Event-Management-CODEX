const csrf = require('csrf');
const tokens = new csrf();

const csrfProtection = (req, res, next) => {
  // Skip CSRF check for these routes
  if (req.path === '/auth/signin' || req.path === '/auth/signup' || req.path === '/auth/verify') {
    return next();
  }

  const token = req.cookies['XSRF-TOKEN'];
  const secret = req.cookies['CSRF-SECRET'];

  if (!token || !secret || !tokens.verify(secret, token)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }

  next();
};

const generateToken = (req, res, next) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);

  res.cookie('CSRF-SECRET', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.cookie('XSRF-TOKEN', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  next();
};

module.exports = { csrfProtection, generateToken };