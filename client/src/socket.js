import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});

// Define and create the socket instance
const URL = import.meta.env.VITE_API_URL || 'https://b5a5fa6778ce4d.lhr.life';
const socket = io(URL); // Create the socket instance

// Set up socket event listeners
socket.on("connect", () => {
    console.log('Client connected');
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
    console.log('Client disconnected');
});

export default new socket;
