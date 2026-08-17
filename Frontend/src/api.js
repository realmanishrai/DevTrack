export const API_BASE_URL = 'http://localhost:8000';

const buildUrl = (url) => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

const createApiError = (response, data) => {
  const message =
    data?.detail ||
    data?.message ||
    response.statusText ||
    'Request failed.';

  const error = new Error(message);
  error.status = response.status;
  error.data = data;

  return error;
};

export const apiRequest = async ({
  url,
  method = 'GET',
  body,
  headers = {},
  retryOnUnauthorized = true,
  isRetry = false,
} = {}) => {
  if (!url) {
    throw new Error('API request URL is required.');
  }

  const requestHeaders = {
    ...headers,
  };

  const requestOptions = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData || body instanceof URLSearchParams) {
      requestOptions.body = body;
    } else {
      requestHeaders['Content-Type'] =
        requestHeaders['Content-Type'] || 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
  }

  const response = await fetch(buildUrl(url), requestOptions);
  const responseData = await parseResponse(response);

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    !isRetry &&
    url !== '/refresh' &&
    url !== '/login'
  ) {
    await apiRequest({
      url: '/refresh',
      method: 'POST',
      retryOnUnauthorized: false,
    });

    return apiRequest({
      url,
      method,
      body,
      headers,
      retryOnUnauthorized: false,
      isRetry: true,
    });
  }

  if (!response.ok) {
    throw createApiError(response, responseData);
  }

  return responseData;
};

export const getCurrentUser = async () => {
  return apiRequest({
    url: '/me',
    method: 'GET',
  });
};

export const getRoomTasks = async (roomCode) => {
  return apiRequest({
    url: `/dashboard/${roomCode}/tasks`,
    method: 'GET',
  });
};

export const createTask = async (roomCode, taskData) => {
  return apiRequest({
    url: `/dashboard/${roomCode}/tasks`,
    method: 'POST',
    body: taskData,
  });
};

export const updateTask = async (roomCode, taskId, taskData) => {
  return apiRequest({
    url: `/dashboard/${roomCode}/tasks/${taskId}`,
    method: 'PUT',
    body: taskData,
  });
};

export const deleteTask = async (roomCode, taskId) => {
  return apiRequest({
    url: `/dashboard/${roomCode}/tasks/${taskId}`,
    method: 'DELETE',
  });
};

export default apiRequest;
