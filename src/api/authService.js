const authService = {
    logout() {
      localStorage.removeItem("token"); // Remove JWT token
      localStorage.removeItem("user"); // Remove user details
    },
  };
  
  export default authService;
  