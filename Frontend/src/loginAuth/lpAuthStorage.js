const LP_ACCESS_TOKEN_KEY = 'devtrack_access_token';
const LP_REFRESH_TOKEN_KEY = 'devtrack_refresh_token';

const getLpAuthStorage = (rememberMe) => {
  return rememberMe ? localStorage : sessionStorage;
};

export const saveLpAuthTokens = (
  accessToken,
  refreshToken,
  rememberMe = true
) => {
  const storage = getLpAuthStorage(rememberMe);

  storage.setItem(LP_ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(LP_REFRESH_TOKEN_KEY, refreshToken);
};

export const getLpAccessToken = () => {
  return (
    localStorage.getItem(LP_ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(LP_ACCESS_TOKEN_KEY)
  );
};

export const getLpRefreshToken = () => {
  return (
    localStorage.getItem(LP_REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(LP_REFRESH_TOKEN_KEY)
  );
};

export const updateLpAccessToken = (accessToken) => {
  if (localStorage.getItem(LP_ACCESS_TOKEN_KEY)) {
    localStorage.setItem(LP_ACCESS_TOKEN_KEY, accessToken);
  } else {
    sessionStorage.setItem(LP_ACCESS_TOKEN_KEY, accessToken);
  }
};

export const clearLpAuthTokens = () => {
  localStorage.removeItem(LP_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LP_REFRESH_TOKEN_KEY);

  sessionStorage.removeItem(LP_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LP_REFRESH_TOKEN_KEY);
};