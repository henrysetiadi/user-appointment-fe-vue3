<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleCreateAppointment = () => {
  const token = localStorage.getItem('token'); // Check if user is logged in

  if (token) {
    router.push('/appointments'); // Redirect to Appointments Page
  } else {
    router.push('/login'); // Redirect to Login Page
  }
};
</script>

<template>
  <div class="container">
    <div class ="content">
        <h1 class="text-primary">Welcome to User Appointment Management</h1>
        <button class="btn btn-success" @click="handleCreateAppointment">
        Create Appointment
        </button>
    </div>
  </div>
</template>


<style scoped>
.container {
  display: grid;
  place-items: center; /* Centers content horizontally & vertically */
  height: 85vh;
  text-align: center;
}

.content {
  max-width: 600px;
}
</style>