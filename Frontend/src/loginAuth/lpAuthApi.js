import { saveLpAuthTokens, updateLpAccessToken, getLpRefreshToken } from './lpAuthStorage';

const LP_API_BASE_URL = import.meta.env.VITE_API_URL;

export const registerLpUser = async ({
  firstname,
  lasttname,
  username,
  email,
  password,
}) => {
  const response = await fetch(`${LP_API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname,
      lasttname,
      username,
      email,
      password,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.detail || 'Registration failed.');
  }

  return responseData;
};
export const loginLpUser = async (username, password, rememberMe = true) => {
  const loginData = new URLSearchParams();

  loginData.append('username', username);
  loginData.append('password', password);

  const response = await fetch(`${LP_API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: loginData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.detail || 'Login failed.');
  }

  saveLpAuthTokens(
    responseData.access_token,
    responseData.refresh_token ,
    rememberMe 
  );

  return responseData;
};

export const refreshLpAccessToken = async () => {
  const refreshToken = getLpRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is not available.');
  }

  const response = await fetch(`${LP_API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.detail || 'Session refresh failed.');
  }

  updateLpAccessToken(responseData.access_token);

  return responseData.access_token;
};