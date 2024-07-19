<script setup lang="ts">
import { useGlobalStore } from '../store/globalStore.ts';
import { onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
import { useWebApp } from 'vue-tg'
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const store = useGlobalStore();

onMounted(async () => {
  console.log("Fetching user data...");
  await store.fetchUserData();

  console.log("User data fetched:", store.userData);
  console.log("Is Loading:", store.isLoading);
  console.log("Is Ready:", store.isReady);
});

watch(
    () => store.isReady,
    async (newVal) => {
      if (newVal) {
        console.log("Store is ready, redirecting...");
        useWebApp().ready();
        await router.push('/');
      }
    }
);
</script>

<template>
  <div v-if="store.isLoading" class="loading-wrapper">
    <div class="loader-box">
      <div class="loader"></div>
      <div class="loader-text">
        <h2>{{ t('loading') }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-wrapper {
  margin-top: 30vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.loader-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(15, 15, 15, 0.5);
  border-radius: 5px;
  height: 200px;
  width: 200px;
}

.loader {
  border: 1px solid white;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  width: 80px;
  height: 80px;
  animation-name: loading;
  animation-duration: 700ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.loader-text {
  margin-top: 10px;
  padding-top: 10px;
  font-family: Inter, serif;
  font-size: 18px;
  animation-name: fading;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fading {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.95;
  }
}
</style>
