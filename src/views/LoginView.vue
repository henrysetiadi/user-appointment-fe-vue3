<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { useAuth } from '@/composables/useAuth';

const username = ref('');
const errorMessage = ref('');
const router = useRouter();
const { login } = useAuth();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginUser = async () => {
  errorMessage.value = '';

  if (!username.value) {
    errorMessage.value = 'Username is required!';
    return;
  }

  try {
    const response = await api.post('/auth/login', { username: username.value });

    // Store JWT token in localStorage
     //localStorage.setItem('token', response.data.token);
     
    // Store JWT token & update global auth state
    login(response.data.token);
    // Redirect to appointment list
    router.push('/appointments'); // This line is now uncommented

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed!';
  }
};
</script>

<template>
    <div class="login-container">
      <div class="login-content">
        <h2 class="text-center">Login</h2>
        
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input v-model="username" type="text" class="form-control" placeholder="Enter your username" @keyup.enter="loginUser" />
        </div>
  
        <button class="btn btn-primary w-100" @click="loginUser">Login</button>
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Ensure login takes full page height */
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center vertically */
    align-items: center;
    min-height: 85vh; /* Full screen height */
    padding-bottom: 60px; /* Prevent overlap with footer */
  }
  
  /* Login box styling */
  .login-content {
    width: 400px;
    background: white;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  /* Login box styling */
  .login-content {
    width: 400px;
    background: white;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  </style>
  
