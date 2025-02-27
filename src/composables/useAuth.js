import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(!!localStorage.getItem('token'));

export function useAuth() {
  const router = useRouter();

  const login = (token) => {
    localStorage.setItem('token', token);
    isAuthenticated.value = true;
    router.replace(router.currentRoute.value.fullPath); // Refresh page after login
  };

  const logout = () => {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
    router.replace('/login'); // Force redirect to login page
  };

  watchEffect(() => {
    isAuthenticated.value = !!localStorage.getItem('token');
  });

  return { isAuthenticated, login, logout };
}
