<script setup>
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { isAuthenticated, logout } = useAuth();
const router = useRouter();
</script>

<template>
  <nav class="navbar navbar-expand-lg shadow-sm">
    <div class="container">
      <!-- Left: Logo -->
      <a class="navbar-brand fw-bold" @click="router.push('/')" style="cursor: pointer;">
        <img src="@/assets/logo.png" alt="Logo" width="200" class="me-2" />
      </a>

      <!-- Toggle button for mobile -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Right: Menu -->
        <ul class="navbar-nav ms-auto">
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link to="/login" class="nav-link btn btn-light px-4 py-2 mx-1">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="nav-link btn btn-dark px-4 py-2 mx-1">Register</router-link>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link to="/appointments" class="nav-link px-4 py-2 mx-1">Appointments</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/users" class="nav-link px-4 py-2 mx-1">Users</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link px-4 py-2 mx-1">Profile</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-danger px-4 py-2 ms-3" @click="logout">Logout</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar background */
.navbar {
  background-color: #1dc2db;
  padding: 12px 0;
}

/* Logo */
.navbar-brand img {
  vertical-align: middle;
}

/* Nav Links */
.navbar-nav .nav-link {
  color: white !important;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

/* Hover effect */
.navbar-nav .nav-link:hover {
  background-color: #102a43;
  transform: translateY(-2px);
}

/* Active Link */
.navbar-nav .router-link-active {
  background-color: white;
  color: #1dc2db !important;
}

/* Button styles */
.btn {
  font-weight: 600;
  border-radius: 10px;
}

/* Logout Button */
.btn-danger {
  background-color: #ff4d4d;
  border: none;
}

.btn-danger:hover {
  background-color: #ff3333;
  transform: scale(1.05);
}
</style>
