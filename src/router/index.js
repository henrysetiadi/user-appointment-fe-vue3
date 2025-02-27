import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
//import AppointmentsView from '@/views/AppointmentsView.vue';
import UserList from "@/views/UserList.vue"; // Import the profile page
import UserProfile from "@/views/UserProfile.vue"; // Import the profile page
import AppointmentList from "@/views/AppointmentList.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/register', component: RegisterView },
    { path: '/login', component: LoginView },
    { 
        path: '/appointments', 
        component: AppointmentList,
        meta: { requiresAuth: true } 
    }, 
    { path: "/users", component: UserList, meta: { requiresAuth: true } }, 
    { path: "/profile", component: UserProfile, meta: { requiresAuth: true } }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
      next('/login');  // Redirect to login if not authenticated
    } else {
      next();
    }
});

export default router;
