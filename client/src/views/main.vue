<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStore } from "../store/globalStore.ts";
import { useI18n } from "vue-i18n";
import Dashboard from "../components/dashboard.vue";
import ProgressBar from "../components/progressBar.vue";
import UserInfo from "../components/userInfo.vue";
import Clicker from "../components/clicker.vue";

// Initialize the store and i18n
const store = useGlobalStore();
const { t } = useI18n();

// Define computed properties
const userData = computed(() => store.userData);

const formattedBalance = computed(() => {
  const balance = userData.value?.balance ?? 0; // Default to 0 if balance is undefined
  return balance.toLocaleString(); // Format number with commas
});
</script>

<template>
  <user-info></user-info>
  <div class="clicker-container">
    <div class="count">
      <h2>{{ formattedBalance }}</h2>
    </div>
    <clicker></clicker>
    <div class="info">
      <div class="details">
        <div class="lvl-position">
          <p class="lvl">{{ userData?.lvl }} lvl</p>
        </div>
        <div class="daily-position">
          <p class="daily">{{ t('daily') }} <span class="value">{{ userData?.daily }}</span></p>
          <img class="arrow" src="https://i.imgur.com/4GbKEj6.png" />
        </div>
      </div>
    </div>
  </div>
  <progress-bar></progress-bar>
  <dashboard></dashboard>
</template>

<style lang="scss">
@import "../assets/style.scss";

.clicker-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  background-color: #1C1C1D;
  border-radius: 15px;
  margin-top: 6vh;
  min-height: 31rem;
  min-width: 100%;
}

img {
  margin-top: 20px;
  display: block;
}

.count {
  margin-top: 2rem;
  font-size: 24px;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info {
  margin-top: 4rem;
  min-height: 5.6rem;
  min-width: 80%;
  max-width: 80%;
  background: linear-gradient(130deg, #0098EA -98.39%, rgba(39, 41, 50, 0.6) 30.18%);
  box-shadow: 0px 4px 7.1px -10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center;
}

.details {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.lvl-position {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  margin-top: 1rem;
}

.lvl {
  color: $fontColor;
  opacity: 0.6;
  font-size: 13px;
}

.daily-position {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
  margin-top: 1rem;
}

.daily {
  color: $fontColor;
  opacity: 0.6;
  font-size: 13px;
}

.value {
  font-size: 14px;
  color: $fontColor;
  opacity: 1;
}

.arrow {
  margin-left: auto;
}
</style>
