import axios from "@/api/axios";

export default {
    async getAppointments() {
        const token = localStorage.getItem("token");
        
        return axios.get("/appointments", {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async createAppointment(appointmentData) {
        const token = localStorage.getItem("token");
        
        return axios.post("/appointments/create", appointmentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async inviteUser(appointmentId, userId) {
        const token = localStorage.getItem("token");
        
        return axios.post(`/appointments/${appointmentId}/invite`, { userId }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async getAvailableUsers(start, end) {
        const token = localStorage.getItem("token");
        
        return axios.get(`/appointments/available-users?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async getAppointmentById(appointmentId) {
        const token = localStorage.getItem("token");
        
        return axios.get(`/appointments/appointmentById/${appointmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async updateAppointment(appointmentId, updatedData) {
        const token = localStorage.getItem("token");

        return axios.put(`/appointments/update/${appointmentId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    async deleteAppointment(appointmentId) {
        const token = localStorage.getItem("token");
    
        try {
            const response = await axios.delete(`/appointments/delete/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting appointment:", error);
            throw error;
        }
    },
    
    // Combined function to get appointment details and available users
    async getAppointmentAndUsers(appointmentId, start, end) {
        const token = localStorage.getItem("token");
        
        try {
            const [appointmentResponse, usersResponse] = await Promise.all([
                axios.get(`/appointments/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`/appointments/available-users?start=${start}&end=${end}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            
            return {
                appointment: appointmentResponse.data,
                availableUsers: usersResponse.data,
            };
        } catch (error) {
            console.error("Error fetching appointment or users:", error);
            throw error;
        }
    },
};
