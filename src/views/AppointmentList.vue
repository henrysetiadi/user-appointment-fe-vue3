<template>
    <div class="page-container">
        <div class="content">
            <div class="container mt-4">
                <h2 class="text-primary">Your Appointments, 
                    <span class="span-profile-name" v-if="myprofile">
                         {{ myprofile.name }}
                    </span>
                </h2>
                
                <div class="divsp">
                    <button class="btn btn-success mb-3" @click="showCreateModal = true">
                        + Create Appointment
                    </button>
                </div>
    
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Creator</th>
                            <th>Participants</th> <!-- Added column for participants -->
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="appointments.length === 0">
                            <td colspan="5" class="text-center text-muted">No appointments available.</td>
                        </tr>
                        <tr v-for="appointment in appointments" :key="appointment.id">
                            <td>{{ appointment.title }}</td>
                            <td>{{ formatTime(appointment.start) }}</td>
                            <td>{{ formatTime(appointment.end) }}</td>
                            <td>{{ appointment.creator.name }}</td>
                            <td>{{ formatParticipants(appointment.participants) }}</td> <!-- Show participants here -->
                            <td>
                                <template v-if="appointment.creatorId === myprofile.id">
                                    <button class="btn btn-primary btn-sm" @click="openInviteModal(appointment.id)">Invite</button> &nbsp;
                                    <button class="btn btn-danger btn-sm" @click="deleteAppointment(appointment.id)"> Delete</button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
                <!-- Create Appointment Modal -->
                <div v-if="showCreateModal" class="modal-overlay">
                    <div class="modal-content">
                        <h3>Create Appointment</h3>
                        <form @submit.prevent="createAppointment">
                            <div class="mb-2">
                                <label>Title:</label>
                                <input type="text" v-model="newAppointment.title" class="form-control" required />
                                <p v-if="errors.title" class="text-danger">{{ errors.title }}</p>
                            </div>
                            <div class="mb-2">
                                <label>Start Time:</label>
                                <input type="datetime-local" v-model="newAppointment.start" class="form-control" :min="minStartDate"  required @change="handleDoubleChange"/>
                                <p v-if="errors.start" class="text-danger">{{ errors.start }}</p>
                            </div>
                            <div class="mb-2">
                                <label>End Time:</label>
                                <input type="datetime-local" v-model="newAppointment.end" class="form-control" :min="minEndDate" required @change="fetchAvailableUsers"/>
                                <p v-if="errors.end" class="text-danger">{{ errors.end }}</p>
                            </div>
                            
                            <div class="mb-2">
                                <label>Invite Users:</label>
                                <select v-model="newAppointment.invitedUserIds" class="form-control" multiple>
                                    <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                                        {{ user.name }}
                                    </option>
                                </select>
                                 <p v-if="errors.invitedUserIds" class="text-danger">{{ errors.invitedUserIds }}</p>
                            </div>
                            <button type="submit" class="btn btn-success">Create</button> &nbsp;
                            <button type="button" class="btn btn-secondary" @click="resetForm(); showCreateModal = false">Cancel</button>
                        </form>
                    </div>
                </div>

                <!-- Invite Users Modal -->
                <div v-if="showInviteModal" class="modal-overlay">
                    <div class="modal-content">
                        <h3>Invite Users</h3>
                        <form @submit.prevent="updateAppointment">
                            <div class="mb-2">
                                <label>Title:</label>
                                <input type="text" v-model="appointmentToUpdate.title" class="form-control" required />
                            </div>
                            <div class="mb-2">
                                <label>Start Time:</label>
                                <input type="datetime-local" v-model="appointmentToUpdate.start" class="form-control" required  readonly/>
                            </div>
                            <div class="mb-2">
                                <label>End Time:</label>
                                <input type="datetime-local" v-model="appointmentToUpdate.end" class="form-control" required  readonly/>
                            </div>
                            
                            <div class="mb-2">
                                <label>Invite Users:</label>
                                <select v-model="appointmentToUpdate.invitedUserIds" class="form-control" multiple>
                                    <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                                        {{ user.name }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-success">Update</button> &nbsp;
                            <button type="button" class="btn btn-secondary" @click="resetForm(); showInviteModal = false">Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import appointmentApi from "@/api/appointment";
import { format } from "date-fns";
import axios from "@/api/axios";
import moment from "moment-timezone";

export default {
    data() {
        return {
            appointments: [],
            showCreateModal: false,
            showInviteModal: false,
            newAppointment: {
                title: "",
                start: "",
                end: "",
                invitedUserIds: [],
            },
            appointmentToUpdate: {
                id: "",
                title: "",
                start: "",
                end: "",
                invitedUserIds: [],
            },
            availableUsers: [],
            myprofile : null,
            errors:{},
            
        };
    },
    async created() {
        await this.fetchProfile();
        await this.fetchAppointments();
    },
    computed:{
        minStartDate() {
            return this.formatDateForGetData(new Date()); // Today's date as min value
        },
        minEndDate() {
            return this.newAppointment.start ? this.newAppointment.start : this.minStartDate;
        }
    },
    methods: {
        async fetchProfile(){
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
                this.myprofile = response.data;
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        },

        async fetchAppointments() {
            try {
                const response = await appointmentApi.getAppointments();
                this.appointments = response.data;
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        },
        async fetchAvailableUsers() {
            if (!this.newAppointment.start || !this.newAppointment.end) return;

            try {
                const response = await appointmentApi.getAvailableUsers(this.newAppointment.start, this.newAppointment.end);
                
                if(response.data.result && response.data.result.hasOwnProperty("message"))
                {
                    
                    this.availableUsers = [];
                    alert(response.data.result.message + ". Next Available Time After: " + response.data.result.nextAvailableTime)
                    this.newAppointment.start = "";
                    this.newAppointment.end = "";
                    return false;
                }
                else
                {
                    this.availableUsers = response.data.result.availableUsers || [];
                }
                
            } catch (error) {
                
                console.error("Error fetching available users:", error);
            }
        },

        async fetchAvailableUsersOnUpdate() {
            if (!this.appointmentToUpdate.start || !this.appointmentToUpdate.end) return;

            try {
                const response = await appointmentApi.getAvailableUsers(this.appointmentToUpdate.start, this.appointmentToUpdate.end);

                this.availableUsers = response.data.result.availableUsers || [];
            } catch (error) {
                console.error("Error fetching available users:", error);
            }
        },
        async openInviteModal(appointmentId) {
            try {
                const response = await appointmentApi.getAppointmentById(appointmentId);

                const appointmentData = response.data;
                this.appointmentToUpdate.id = appointmentData.id;
                this.appointmentToUpdate.title = appointmentData.title;
                this.appointmentToUpdate.start = this.formatTime(appointmentData.start);
                this.appointmentToUpdate.end = this.formatTime(appointmentData.end);

                this.fetchAvailableUsersOnUpdate();
                this.appointmentToUpdate.invitedUserIds = appointmentData.participants.map(participant => participant.userId);
                this.appointmentToUpdate.invitedUsers = appointmentData.participants.map(participant => participant.user.name);

                this.showInviteModal = true;
            } catch (error) {
                console.error("Error fetching appointment details:", error);
            }
        },
        async updateAppointment() {
            this.errors = {}; // Reset error sebelum validasi baru

            if (!this.appointmentToUpdate.title) {
                this.errors.title = "Title is required.";
            }
            if (!this.appointmentToUpdate.start) {
                this.errors.start = "Start time is required.";
            }
            if (!this.appointmentToUpdate.end) {
                this.errors.end = "End time is required.";
            }
            if (!this.appointmentToUpdate.invitedUserIds.length) {
                this.errors.invitedUserIds = "At least one user must be invited.";
            }

            // Jika ada error, hentikan proses
            if (Object.keys(this.errors).length > 0) {
                return;
            }

            try {
                const resp = await appointmentApi.updateAppointment(this.appointmentToUpdate.id, this.appointmentToUpdate);
                if(resp.data.status)
                {
                    alert(resp.data.message);
                    return false;
                }
                this.showInviteModal = false;
                this.fetchAppointments();
                this.resetForm();
            } catch (error) {
                console.error("Error updating appointment:", error);
            }
        },
        async createAppointment() {
            this.errors = {}; // Reset error sebelum validasi baru
    
            if (!this.newAppointment.title) {
                this.errors.title = "Title is required.";
            }
            if (!this.newAppointment.start) {
                this.errors.start = "Start time is required.";
            }
            if (!this.newAppointment.end) {
                this.errors.end = "End time is required.";
            }
            if (!this.newAppointment.invitedUserIds.length) {
                this.errors.invitedUserIds = "At least one user must be invited.";
            }

            // Jika ada error, hentikan proses
            if (Object.keys(this.errors).length > 0) {
                return;
            }

            try {
                const resp = await appointmentApi.createAppointment(this.newAppointment);
                
                if(resp.data.status)
                {
                    alert(resp.data.message);
                    this.newAppointment.start = "";
                    this.newAppointment.end = "";
                    this.newAppointment.invitedUserIds=[];
                    this.availableUsers = [];
                    return false;
                }
                this.showCreateModal = false;
                this.fetchAppointments();
                this.resetForm();
            } catch (error) {
                console.error("Error creating appointment:", error);
            }
        },

        async deleteAppointment(appointmentId) {
            // Confirm with the user before deleting
            const isConfirmed = confirm("Are you sure you want to delete this appointment?");
            if (isConfirmed) {
                try {
                    // Call the API to delete the appointment
                    await appointmentApi.deleteAppointment(appointmentId);
                    // Refresh the appointment list after deletion
                    this.fetchAppointments();
                } catch (error) {
                    console.error("Error deleting appointment:", error);
                }
            }
        },
        formatTime(dateTime) {

            //return format(new Date(dateTime), "yyyy-MM-dd HH:mm");
            if (!dateTime || !this.myprofile || !this.myprofile.preferredTimezone) {
                return "Invalid Date";
            }
            return moment.utc(dateTime).tz(this.myprofile.preferredTimezone).format("YYYY-MM-DD HH:mm");
        
        },

        formatParticipants(participants) {
            // Extract participant names and join them into a comma-separated string
            return participants.map(participant => participant.user.name).join(", ");
        },

        formatDateForGetData(date) {
            const jsDate = new Date(date);

            const year = jsDate.getFullYear();
            const month = String(jsDate.getMonth() + 1).padStart(2, '0');
            const day = String(jsDate.getDate()).padStart(2, '0');
            const hours = String(jsDate.getHours()).padStart(2, '0');
            const minutes = String(jsDate.getMinutes()).padStart(2, '0');

            return `${year}-${month}-${day}T${hours}:${minutes}`;
        },
        resetForm() {
            this.newAppointment = { title: "", start: "", end: "", invitedUserIds: [] };
            this.appointmentToUpdate = { id: "", title: "", start: "", end: "", invitedUserIds: [] };
            this.errors = {}; // Reset error
        },
        adjustEndDate() {
        if (this.newAppointment.end && this.newAppointment.end < this.newAppointment.start) {
            this.newAppointment.end = this.newAppointment.start; // Prevent invalid end time
        }},
        handleDoubleChange(){
            this.adjustEndDate();
            this.fetchAvailableUsers();
        }    
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
    .divsp {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .span-profile-name{
        color:#102a43;
    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
    }
    </style>
    