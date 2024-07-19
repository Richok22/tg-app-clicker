<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useGlobalStore } from "../store/globalStore.ts";

const store = useGlobalStore();

const energy = computed(() => store.userData?.energy ?? 0);
const maxEnergy = computed(() => store.userData?.maxEnergy ?? 1000);

// Function to restore energy
const restoreEnergy = () => {
  if (store.userData && store.userData.energy < store.userData.maxEnergy) {
    store.userData.energy++;
  }
};

// Set up the interval for restoring energy
let energyInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  energyInterval = setInterval(restoreEnergy, 3000); // UZ SERVERU
});

onUnmounted(() => {
  clearInterval(energyInterval); // hz ko tas darija
});
</script>

<template>
  <div class="progress-bar-container">
    <h2>{{ energy }} / {{ maxEnergy }}</h2>
    <div class="progress-bar" :style="{ width: (energy / maxEnergy) * 100 + '%' }"></div>
  </div>
</template>

<style scoped>
.progress-bar-container {
  margin-top: 1.5vh;
}

h2 {
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bar {
  filter: drop-shadow(0px 4px 4px #000000);
  height: 1rem;
  width: 100%;
  background: linear-gradient(to right, #2D83EC, #1AC9FF);
  border-radius: 83px;
  text-align: center;
  line-height: 30px;

  font-weight: bold;
  transition: width 0.3s ease; /* Smooth transition */
}
</style>
