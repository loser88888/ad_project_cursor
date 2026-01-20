import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userApi } from '../api/user';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = () => !!token.value;

  const setToken = (newToken) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const setUser = (userData) => {
    user.value = userData;
  };

  const login = async (credentials) => {
    const response = await userApi.login(credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const getUserInfo = async () => {
    const response = await userApi.getUserInfo();
    setUser(response.data);
    return response;
  };

  return {
    user,
    token,
    isAuthenticated,
    setToken,
    setUser,
    login,
    logout,
    getUserInfo,
  };
});
