import { defineStore } from 'pinia';
import { useWebApp } from 'vue-tg';
import axios from 'axios';

interface LoadingState {
    loading: boolean;
    isReady: boolean;
}

type UserData = {
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
    is_premium: boolean;
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

type MyState = {
    loading: LoadingState;
    userData?: UserData | null;
    FriendData?: FriendData | null;
    friends: [],
    tasks: Task[];
};

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loading: { loading: true, isReady: false },
        userData: null,
        friends: [],
        tasks: [],
    } as MyState),
    getters: {
        isLoading: (state): boolean => state.loading.loading,
        isReady: (state): boolean => state.loading.isReady,
        activeTab: (state): string => state.userData?.activeTab || 'main', // Default to 'main'
        getTasks: (state): Task[] => state.tasks,
    },
    actions: {
        async fetchFriends() {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + `/api/friends/${this.userData?.tgId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200 && response.headers['content-type'] === 'application/json') {
                    this.friends = response.data;
                } else {
                    console.error('Unexpected response:', response);
                    this.friends = response.data;
                }
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            } finally {

            }
        },
        async fetchUserData() {
            this.startLoading();
            try {
                const user = await this.getUserData();
                this.userData = user;

                // Log the referral code before sending it to the backend
                console.log('Referral Code:', this.userData.referralCode);

                const response = await axios.post(import.meta.env.VITE_API_URL + '/api/register', {
                    tgId: this.userData.tgId,
                    username: this.userData.username,
                    photoUrl: this.userData.photoUrl || '',
                    referralCode: this.userData.referralCode,
                    is_premium: this.userData.is_premium,
                });

                if (response.status === 200) {
                    console.log('User registered successfully:', response.data);
                    if (response.data.created) {

                    } else {
                        // User already exists, load the user data
                        await this.loadUserData();
                    }
                } else {
                    console.error('Unexpected response during registration:', response);
                }
            } catch (e) {
                console.error('Failed to fetch user data:', e);
                await this.loadUserData(); // Attempt to load user data even on failure
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
                const response = await axios.get(import.meta.env.VITE_API_URL + `/api/load/${this.userData.tgId}`);
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

            let referralCode = webApp.initDataUnsafe.start_param

            return {
                tgId: user?.id || '',
                username: user?.first_name || '',
                referralCode: referralCode,
                is_premium: user?.is_premium,
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
        setReferralCode(code: string) {
            if (this.userData) {
                this.userData.referralCode = code;
            }
        },
    },
});
