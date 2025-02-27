<template>
    <div class="page-container">
      <div class="content">
        <div class="container mt-4">
          <h2 class="text-primary">User List</h2>
  
          <!-- Search Bar -->
          <div class="mb-3">
            <label>Search:</label>
            <input v-model="search" @input="debouncedSearch" class="form-control" placeholder="Search by name, username, or timezone" />
          </div>
  
          <!-- Dropdown for items per page -->
          <div class="mb-3">
            <label>Show: </label>
            <select v-model="perPage" @change="fetchUsers">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
  
          <!-- User Table -->
          <table class="table table-bordered">
            <thead>
              <tr>
                <th><b>Name</b></th>
                <th><b>Username</b></th>
                <th><b>Preferred Timezone</b></th>
                <th><b>GMT Offset</b></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.preferredTimezone }}</td>
                <td>{{ user.gmtOffset }}</td>
              </tr>
            </tbody>
          </table>
  
          <!-- Pagination Controls -->
          <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "@/api/axios";
  import { debounce } from "lodash";  // Import lodash for debouncing
  
  export default {
    data() {
      return {
        users: [],
        currentPage: 1,
        totalPages: 1,
        perPage: 10,
        search: '',  // Added search query
      };
    },
    methods: {
      // Debounced search to limit API calls
      debouncedSearch: debounce(function() {
        this.fetchUsers();
      }, 500),  // Delay of 500ms
  
      async fetchUsers() {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`/listUsers?page=${this.currentPage}&limit=${this.perPage}&search=${this.search}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          this.users = response.data.users;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
  
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.fetchUsers();
        }
      },
    },
  
    watch: {
      // Watch for changes in search input and trigger debounced fetch
      search(newSearch) {
        this.debouncedSearch();
      },
    },
  
    created() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 85vh;
  }
  .content {
    flex-grow: 1;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
  }
  </style>
  