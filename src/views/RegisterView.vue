<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';

const name = ref('');
const username = ref('');
const preferredTimezone = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

// Full list of time zones (sorted from GMT-12 to GMT+14)
const timezones = [
  { label: "GMT-12:00 (International Date Line West)", value: "Etc/GMT+12" },
  { label: "GMT-11:00 (Midway, Samoa)", value: "Pacific/Midway" },
  { label: "GMT-10:00 (Hawaii)", value: "Pacific/Honolulu" },
  { label: "GMT-09:00 (Alaska)", value: "America/Anchorage" },
  { label: "GMT-08:00 (Pacific Time)", value: "America/Los_Angeles" },
  { label: "GMT-07:00 (Mountain Time)", value: "America/Denver" },
  { label: "GMT-06:00 (Central Time)", value: "America/Chicago" },
  { label: "GMT-05:00 (Eastern Time)", value: "America/New_York" },
  { label: "GMT-04:00 (Atlantic Time)", value: "America/Halifax" },
  { label: "GMT-03:00 (Buenos Aires)", value: "America/Argentina/Buenos_Aires" },
  { label: "GMT-02:00 (South Georgia)", value: "Atlantic/South_Georgia" },
  { label: "GMT-01:00 (Azores)", value: "Atlantic/Azores" },
  { label: "GMT+00:00 (UTC, London)", value: "UTC" },
  { label: "GMT+01:00 (Berlin, Paris)", value: "Europe/Berlin" },
  { label: "GMT+02:00 (Athens, Bucharest)", value: "Europe/Athens" },
  { label: "GMT+03:00 (Moscow, Nairobi)", value: "Europe/Moscow" },
  { label: "GMT+04:00 (Dubai, Baku)", value: "Asia/Dubai" },
  { label: "GMT+05:00 (Islamabad, Tashkent)", value: "Asia/Tashkent" },
  { label: "GMT+06:00 (Dhaka, Almaty)", value: "Asia/Dhaka" },
  { label: "GMT+07:00 (Bangkok, Jakarta)", value: "Asia/Jakarta" },
  { label: "GMT+08:00 (Beijing, Singapore)", value: "Asia/Singapore" },
  { label: "GMT+09:00 (Tokyo, Seoul)", value: "Asia/Tokyo" },
  { label: "GMT+10:00 (Sydney, Vladivostok)", value: "Australia/Sydney" },
  { label: "GMT+11:00 (Solomon Islands)", value: "Pacific/Guadalcanal" },
  { label: "GMT+12:00 (Auckland, Fiji)", value: "Pacific/Auckland" },
  { label: "GMT+13:00 (Samoa, Tonga)", value: "Pacific/Tongatapu" },
  { label: "GMT+14:00 (Kiritimati)", value: "Pacific/Kiritimati" }
];

const register = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!name.value || !username.value || !preferredTimezone.value) {
    errorMessage.value = 'All fields are required!';
    return;
  }

  try {
    const response = await api.post('/auth/register', {
      name: name.value,
      username: username.value,
      preferredTimezone: preferredTimezone.value
    });

    successMessage.value = 'Registration successful! Redirecting to login...';

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed!';
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-content">
      <h2 class="text-center">Register</h2>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="name" type="text" class="form-control" placeholder="Enter your full name" />
      </div>

      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" placeholder="Choose a username" />
      </div>

      <div class="mb-3">
        <label class="form-label">Preferred Timezone</label>
        <select v-model="preferredTimezone" class="form-control">
          <option disabled value="">Select your timezone</option>
          <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
            {{ tz.label }}
          </option>
        </select>
      </div>

      <button class="btn btn-primary w-100" @click="register">Register</button>
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding-bottom: 60px;
}

.register-content {
  width: 400px;
  background: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
