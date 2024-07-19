<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalStore } from '../store/globalStore.ts';
import { useWebAppHapticFeedback } from 'vue-tg';
import { socket } from "../socket";

const store = useGlobalStore();

const showPlusOne = ref(false);
const plusOnePosition = ref({ top: '0px', left: '0px' });
const plusOneKey = ref(0);
const isActive = ref(false);

const incrementBalance = async () => {
  if (store.userData && store.userData.energy > 0) {
    useWebAppHapticFeedback().impactOccurred("medium");

    // Update local store data
    store.userData.balance += 1 * store.userData.coin_multiplier;
    store.userData.energy--;
    store.userData.exp++;

    const { balance, energy, exp, tgId, lvl, coin_multiplier } = store.userData;

    // Emit data to server
    socket.timeout(5000).emit("user_tap", tgId, balance, energy, exp, lvl, coin_multiplier, () => {
      console.log("Sent tap data #" + store.userData?.tgId);
    });

    // Update user data based on experience
    if (store.userData.maxExp === store.userData.exp) {
      store.userData.lvl++;
      store.userData.maxExp *= 3;
      store.userData.exp = 0;

      if (store.userData.lvl >= 3) {
        store.userData.coin_multiplier += 1;
      }

      if (store.userData.lvl >= 5) {
        store.userData.maxEnergy *= store.userData.energy_multiplier;
        store.userData.energy = store.userData.maxEnergy;
      }
    }

    // Update plus one position and key for animation
    plusOnePosition.value = {
      top: `${Math.random() * 4}rem`,
      left: `${Math.random() * 6}rem`,
    };

    plusOneKey.value++;
    showPlusOne.value = true;

    await new Promise(resolve => setTimeout(resolve, 4000));

    showPlusOne.value = false;
  }
};

const handleMouseDown = () => {
  if (0 < store.userData.energy) {
    isActive.value = true;
  }
};

const handleMouseUp = () => {
  isActive.value = false;
};
</script>

<template>
  <div class="balance-container">
    <img
        width="200"
        height="200"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @touchstart="handleMouseDown"
        @touchend="handleMouseUp"
        @click="incrementBalance"
        src="https://i.imgur.com/gpiwDfh.png"
        :class="{
        active: isActive,
        disabled: store.userData.energy <= 0
      }"
        :style="{ opacity: store.userData.energy <= 0 ? 0.5 : 1 }"
    />
    <transition name="fade-move">
      <div v-if="showPlusOne" :key="plusOneKey" class="plus-one" :style="plusOnePosition">+{{ store.userData.coin_multiplier }}</div>
    </transition>
  </div>
</template>

<style scoped>
.balance-container {
  position: relative;
  width: 200px;
  height: 200px;
}

img {
  transition: transform 0.1s ease;
}

img.active {
  transform: scale(0.95);
}

img.disabled {
  cursor: not-allowed;
  filter: grayscale(100%);
  opacity: 0.5;
}

.plus-one {
  position: absolute;
  font-size: 34px;
  color: #ffffff;
  transition: transform 1s ease-out, opacity 1s ease-out;
}

.fade-move-enter-active,
.fade-move-leave-active {
  transition: transform 1s ease-out, opacity 1s ease-out;
}

.fade-move-enter-from,
.fade-move-leave-to {
  opacity: 0;
  transform: translateY(0);
}

.fade-move-enter-to,
.fade-move-leave-from {
  opacity: 1;
  transform: translateY(-30px);
}
</style>
