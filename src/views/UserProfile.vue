<template>
    
<div class="page-container">
    <!-- Main Content -->
    <div class="content">
        <div class="d-flex justify-content-center align-items-center">
        <div class="card shadow-lg p-4" style="width: 400px;">
            <div class="card-body text-center">
            <h3 class="card-title text-primary">User Profile</h3>
            <hr />
            <div v-if="user">
                <p><strong>Name:</strong> {{ user.name }}</p>
                <p><strong>Username:</strong> {{ user.username }}</p>
                <p><strong>Preferred Timezone:</strong> {{ user.preferredTimezone }}</p>
                <p><strong>GMT Offset:</strong> {{ user.gmtOffset >= 0 ? '+' : '' }}{{ user.gmtOffset }}</p>
            </div>
            <div v-else>
                <p>Loading user data...</p>
            </div>
            </div>
        </div>
        </div>
    </div>
</div>
  </template>
  
  <script>
  import axios from "@/api/axios";
  
  export default {
    data() {
      return {
        user: null,
      };
    },
    async created() {
      try {
        const token = localStorage.getItem("token"); // Get JWT token from localStorage
  
        if (!token) {
          console.error("No authentication token found!");
          return;
        }
  
        const response = await axios.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in headers
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
  };
  </script>
  
<style scoped>
    .page-container {
    display: flex;
    flex-direction: column;
    min-height: 85vh; /* Ensures the page takes full height */
    }

    /* Push content to fill space */
    .content {
    flex-grow: 1;
    }

    /* Improved Card Styling */
    .card {
        border-radius: 12px;
        transition: all 0.3s ease-in-out;
    }
    
    .card:hover {
        transform: scale(1.02);
    }
    
    /* Center Content */
    .d-flex {
        height: 80vh;
    }
  
    /* Text Styling */
    p {
        font-size: 1.1rem;
    }
</style>
  