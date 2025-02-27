<script setup>
import { ref, onMounted } from 'vue';

const appointments = ref([]);

onMounted(() => {
  // Simulated API call to fetch appointments
  appointments.value = [
    { id: 1, title: 'Team Meeting', start: '2025-02-26 10:00', end: '2025-02-26 11:00' },
    { id: 2, title: 'Client Call', start: '2025-02-27 14:00', end: '2025-02-27 15:00' }
  ];
});
</script>

<template>
  <div class="page-container">
    <!-- Main Content -->
    <div class="content">
      <div class="container mt-4">
        <h2>Appointments</h2>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
              <td>{{ appointment.title }}</td>
              <td>{{ appointment.start }}</td>
              <td>{{ appointment.end }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Full height layout */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 85vh; /* Ensures the page takes full height */
}

/* Push content to fill space */
.content {
  flex-grow: 1;
}

/* Sticky Footer */
.footer {
  background-color: #333; /* Charcoal color */
  color: white;
  text-align: center;
  padding: 10px 0;
}
</style>
