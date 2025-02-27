<template>
    <footer class="footer">
      <div class="container text-center">
        <p class="mb-1">&copy; 2025 User Appointment Management. All Rights Reserved.</p>
        <!-- <ul class="footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/appointments">Appointments</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
        </ul> -->
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background-color: #2d2d2d; /* Charcoal color */
    color: #ffffff; /* White text */
    padding: 20px 0;
    width: 100%;
    bottom: 0;
    position:relative;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
  }
  
  .footer-links a {
    color: #1dc2db; /* Match primary theme color */
    text-decoration: none;
    font-weight: 500;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  </style>
  