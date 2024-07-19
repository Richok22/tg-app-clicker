import {defineStore} from 'pinia';
import {useWebApp} from 'vue-tg';
import axios from 'axios';

interface LoadingState {
    loading: boolean;
    isReady: boolean;
}

interface UserData {
    tgId: any;
    username: string;
    balance: number;
    lvl: number;
    exp: number;
    maxExp: number;
    daily: number;
    energy: number;
    maxEnergy: number;
    coin_multiplier: number;
    energy_multiplier: number;
    activeTab: string;
    referralCode: string;
}

interface Task {
    icon: string;
    name: string;
    award: number;
    link: string;
    chatId?: string;
}

interface FriendData {
    username: string;
    balance: number;
}

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loading: {loading: true, isReady: false} as LoadingState,
        userData: null as UserData | null,
        FriendData: null as FriendData | null,
        tasks: [] as Task[],
    }),
    getters: {
        isLoading: (state): boolean => state.loading.loading,
        isReady: (state): boolean => state.loading.isReady,
        activeTab: (state): string => state.userData?.activeTab || 'main', // Default to 'main'
        getTasks: (state): Task[] => state.tasks,
    },
    actions: {
        async fetchUserData() {
            this.startLoading();
            try {
                const user = await this.getUserData();
                this.userData = user;

                const response = await axios.post(import.meta.env.VITE_API_URL + '/api/register', {
                    tgId: this.userData.tgId,
                    username: this.userData.username,
                }, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });

                if (response.data.created) {
                    console.log('User registered successfully:', response.data);
                } else {
                    await this.loadUserData();
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                this.endLoading();
            }
        },

        async loadUserData() {
            if (!this.userData) {
                console.error('User data is not available');
                return;
            }

            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + `/api/users/${this.userData.tgId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true"
                    }
                });
                this.userData = response.data;
                console.log('User data loaded:', this.userData);
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        },
        async getUserData(): Promise<UserData> {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const webApp = useWebApp();
            const user = webApp.initDataUnsafe.user;

            return {
                tgId: user?.id || '',
                username: user?.first_name || '',
                balance: 0,
                lvl: 1,
                exp: 0,
                maxExp: 10,
                daily: 0,
                energy: 1000,
                maxEnergy: 1000,
                coin_multiplier: 1,
                energy_multiplier: 1,
                activeTab: "main",
                referralCode: "test-referal"
            };
        },
        startLoading() {
            this.loading.loading = true;
            this.loading.isReady = false;
        },
        endLoading() {
            this.loading.loading = false;
            this.loading.isReady = true;
        },
        setActiveTab(tab: string) {
            if (this.userData) {
                this.userData.activeTab = tab; //
            }
        },
        addTask(task: Task) {
            this.tasks.push(task);
        },
        removeTask(taskName: string) {
            this.tasks = this.tasks.filter(task => task.name !== taskName);
        },
    },
});
