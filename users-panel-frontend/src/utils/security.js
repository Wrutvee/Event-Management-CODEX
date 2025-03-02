// Input sanitization
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.replace(/[<>]/g, '');
};

// Password validation
export const isPasswordStrong = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Rate limiting
class RateLimiter {
  constructor() {
    this.attempts = {};
    this.lockouts = {};
    this.maxAttempts = 5;
    this.lockoutTime = 30 * 60 * 1000; // 30 minutes
  }

  checkLimit(key) {
    // Check if currently locked out
    if (this.lockouts[key] && this.lockouts[key] > Date.now()) {
      return false;
    }

    // Reset lockout if it's expired
    if (this.lockouts[key] && this.lockouts[key] <= Date.now()) {
      delete this.lockouts[key];
      this.attempts[key] = 0;
    }

    // Initialize attempts if not exists
    if (!this.attempts[key]) {
      this.attempts[key] = 0;
    }

    // Increment attempts
    this.attempts[key]++;

    // Check if max attempts reached
    if (this.attempts[key] >= this.maxAttempts) {
      this.lockouts[key] = Date.now() + this.lockoutTime;
      return false;
    }

    return true;
  }

  reset(key) {
    this.attempts[key] = 0;
    delete this.lockouts[key];
  }
}

export const rateLimiter = new RateLimiter();