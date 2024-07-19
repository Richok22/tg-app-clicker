<script setup lang="ts">
import Dashboard from "../components/dashboard.vue";
import progressBar from "../components/progressBar.vue";
import UserInfo from "../components/userInfo.vue";
import Clicker from "../components/clicker.vue";
import {useGlobalStore} from "../store/globalStore.ts";
import {computed} from 'vue';
import {useI18n} from "vue-i18n";


const store = useGlobalStore();
const userData = store.userData;
const { t } = useI18n();


const formattedBalance = computed((): string => {
  const balance: number | undefined = userData.balance;
  if (balance === undefined || balance === null) {
    return '0'; // Or any other default string you prefer
  }
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
          <p class="lvl">{{ userData.lvl }} lvl</p>
        </div>
        <div class="daily-position">
          <p class="daily">{{ t('daily') }} <span class="value">{{ userData.daily }}</span></p>
          <img style="margin-top: 0" class="arrow" src="https://i.imgur.com/4GbKEj6.png">
        </div>
      </div>
    </div>
  </div>
  <progressBar></progressBar>
  <dashboard></dashboard>
</template>

<style lang="scss">
@import "../assets/style.scss";

.clicker-container {
  display: flex;
  flex-direction: column; // Stack elements vertically
  align-items: center; // Center items horizontally
  transition: background-color 0.3s, color 0.3s;
  background-color: #1C1C1D;
  border-radius: 15px;
  margin-top: 6vh;
  min-height: 31rem;
  min-width: 100%;
}

img {
  margin-top: 20px; // Space above the image
  display: block; // Ensure it's a block-level element
}

.count {
  margin-top: 2rem;
  font-size: 24px;
  padding-top: 20px; // Adjust padding as needed
  display: flex;
  justify-content: center; // Center text horizontally
  align-items: center;
}

.info {
  margin-top: 4rem; // Space above the info section
  min-height: 5.6rem;
  min-width: 80%; // Set min-width to 80% of container
  max-width: 80%; // Optional: restrict max width to 80% for consistency
  background: linear-gradient(130deg, #0098EA -98.39%, rgba(39, 41, 50, 0.6) 30.18%);
  box-shadow: 0px 4px 7.1px -10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center; // Center text within the info div
}

.details {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.lvl-position {
  display: flex;
  align-items: center; // Align items vertically in the center
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
  justify-content: space-between; // Distribute items with space between
  align-items: center; // Align items vertically in the center
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
  font-size: 14px; // Increase font size
  color: $fontColor; // Change color to a different one
  opacity: 1; // Ensure full opacity
}

.arrow {
  margin-left: auto;
}

</style>
