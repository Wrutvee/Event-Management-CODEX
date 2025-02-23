let csrfToken = null;
let tokenExpiryTime = null;
const TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes in milliseconds

export const fetchCsrfToken = async () => {
  // Return existing token if it's still valid
  if (csrfToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return csrfToken;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/csrf-token`, {
      credentials: 'include'
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
    tokenExpiryTime = Date.now() + TOKEN_LIFETIME;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

export const addCsrfToken = (headers = {}) => {
  if (csrfToken) {
    return {
      ...headers,
      'X-CSRF-TOKEN': csrfToken
    };
  }
  return headers;
};

export const invalidateToken = () => {
  csrfToken = null;
  tokenExpiryTime = null;
};