export const setAuthToken = async (data) => {
  if (data) {
    await localStorage.setItem('token', data.token);
    await localStorage.setItem('user', JSON.stringify(data.user));
    window.axios && (window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`);
  } else {
    localStorage.removeItem('token');
    window.axios && delete window.axios.defaults.headers.common['Authorization'];
  }
  return true;
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.clear();
};