<!-- src/views/tasks.vue -->
<script setup lang="ts">
import Dashboard from "../components/dashboard.vue";
import Friend from "../components/friend.vue";
import { useGlobalStore } from '../store/globalStore.ts';
import {useWebAppNavigation} from "vue-tg";
import {useI18n} from "vue-i18n";
const { t } = useI18n();

let store = useGlobalStore();

const { openTelegramLink } = useWebAppNavigation(); // Destructure the function from useWebAppNavigation
const openLink = () => {
  openTelegramLink(`https://t.me/share/url?url=t.me/joebiden666trapstarbot/start?referralCode=${store.userData?.referralCode}&text=%F0%9F%92%B0Catizen%3A%20Unleash%2C%20Play%2C%20Earn%20-%20Where%20Every%20Game%20Leads%20to%20an%20Airdrop%20Adventure!%0A%F0%9F%8E%81Let%27s%20play-to-earn%20airdrop%20right%20now!`); // Open the Telegram channel link
};
</script>

<template>
  <div class="page-name">
    <div class="page-title">
      <h2>{{ t('frens') }}</h2>
    </div>
  </div>
  <div class="frens-container">
    <friend />
  </div>
  <button @click="openLink">{{ t('invite') }}</button>
  <dashboard />
</template>

<style lang="scss">
@import "../assets/style.scss";

.frens-container {
  display: flex;
  flex-direction: column; // Stack elements vertically
  align-items: center; // Center items horizontally
  transition: background-color 0.3s, color 0.3s;
  background-color: #1C1C1D;
  border-radius: 15px;
  margin-top: 6vh;
  min-height: 29rem;
  min-width: 100%;
}

.page-name {
  justify-content: center;
  align-items: center;
  display: flex;
  align-self: center;
  text-align: center;
}

.page-title {
  width: 9.75rem;
  border-radius: 7px;
  font-size: 24px;
  background-color: $secondMenuColor;
}

button {
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;

  margin-top: 1rem;
  width: 100%;
  background: linear-gradient(90deg, #2D83EC 0%, #1AC9FF 100%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 11px;
  height: 3.188rem;
}
</style>
