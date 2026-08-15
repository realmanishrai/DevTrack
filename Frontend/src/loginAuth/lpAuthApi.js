import { clearLpAuthTokens } from './lpAuthStorage';
import apiRequest from '../api';

export const registerLpUser = async ({
  firstname,
  lastname,
  username,
  email,
  password,
}) => {
  return apiRequest({
    url: '/register',
    method: 'POST',
    body: {
      firstname,
      lastname,
      username,
      email,
      password,
    },
  });
};
export const loginLpUser = async (username, password, _rememberMe = true) => {
  const loginData = new URLSearchParams();

  loginData.append('username', username);
  loginData.append('password', password);

  return apiRequest({
    url: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: loginData,
    retryOnUnauthorized: false,
  });
};

export const refreshLpAccessToken = async () => {
  return apiRequest({
    url: '/refresh',
    method: 'POST',
    retryOnUnauthorized: false,
  });
};

export const logoutLpUser = async () => {
  const responseData = await apiRequest({
    url: '/logout',
    method: 'POST',
    retryOnUnauthorized: false,
  });

  clearLpAuthTokens();

  return responseData;
};
