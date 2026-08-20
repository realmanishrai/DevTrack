export const saveLpAuthTokens = (
  _accessToken,
  _refreshToken,
  _rememberMe = true
) => {};

export const getLpAccessToken = () => {
  return null;
};

export const getLpRefreshToken = () => {
  return null;
};

export const updateLpAccessToken = (_accessToken) => {};

export const clearLpAuthTokens = () => {
  // Clear any cached auth data from frontend storage
  // Note: httponly cookies are cleared by backend via DELETE /logout
  localStorage.removeItem('devtrack-user');
  localStorage.removeItem('devtrack-auth-token');
  sessionStorage.removeItem('devtrack-user');
  sessionStorage.removeItem('devtrack-auth-token');
  sessionStorage.removeItem('justLoggedOut');
};
