<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useGlobalStore } from '../store/globalStore.ts';
import { useWebAppHapticFeedback } from 'vue-tg';
import socket from '../socket.ts';

// Access the store and create a reactive reference to userData
const store = useGlobalStore();
const userData = computed(() => store.userData);

const showPlusOne = ref(false);
const plusOnePosition = ref({ top: '0px', left: '0px' });
const plusOneKey = ref(0);
const isActive = ref(false);

// Function to increment balance
const incrementBalance = () => {
  if (userData.value && userData.value.energy > 0) {
    useWebAppHapticFeedback().impactOccurred("medium");

    const { tgId } = userData.value;
    socket.timeout(5000).emit("user_tap", tgId, () => {
      console.log("Sent tap data #" + tgId);
    });

    plusOnePosition.value = {
      top: `${Math.random() * 4}rem`,
      left: `${Math.random() * 6}rem`,
    };

    plusOneKey.value++;
    showPlusOne.value = true;

    setTimeout(() => {
      showPlusOne.value = false;
    }, 4000);
  }
};

// Handle mouse events
const handleMouseDown = () => {
  if (userData.value && userData.value.energy > 0) {
    isActive.value = true;
  }
};

const handleMouseUp = () => {
  isActive.value = false;
};

// Handle updates from server
const handleServerUpdate = (updatedData: any) => {
  console.log("Received user data from server:", updatedData);
  store.userData = { ...store.userData, ...updatedData };
};

onMounted(() => {
  socket.on('user_data_update', handleServerUpdate);
});

onBeforeUnmount(() => {
  socket.off('user_data_update', handleServerUpdate);
});
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
        :class="{ active: isActive, disabled: store.userData && store.userData.energy <= 0 }"
        :style="{ opacity: store.userData && store.userData.energy <= 0 ? 0.5 : 1 }"
    />
    <transition name="fade-move">
      <div v-if="showPlusOne" :key="plusOneKey" class="plus-one" :style="plusOnePosition">
        +{{ store.userData && store.userData.coin_multiplier }}
      </div>
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
