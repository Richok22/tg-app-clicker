<template>
  <div class="dashboard-container">
    <div class="dashboard">
      <ul>
        <li class="option-background" :class="{ active: isActive('main') }" @click="setActive('main'); router.push('/')">
          <div class="option">
            <img
                width="19"
                height="19"
                :src="isActive('main') ? iconMap.main.active : iconMap.main.default"
            >
            <RouterLink to="/">{{ t('main') }}</RouterLink>
          </div>
        </li>
        <li class="option-background" :class="{ active: isActive('tasks') }" @click="setActive('tasks'); router.push('/tasks')">
          <div class="option">
            <img
                :src="isActive('tasks') ? iconMap.tasks.active : iconMap.tasks.default"
            >
            <RouterLink to="/tasks">{{ t('tasks') }}</RouterLink>
          </div>
        </li>
        <li class="option-background" :class="{ active: isActive('frens') }" @click="setActive('frens'); router.push('/frens')">
          <div class="option">
            <img
                :src="isActive('frens') ? iconMap.frens.active : iconMap.frens.default"
            >
            <RouterLink to="/frens">{{ t('frens') }}</RouterLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGlobalStore } from "../store/globalStore.ts";
import { useWebAppHapticFeedback } from "vue-tg";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useGlobalStore();
const activeTab = ref(store.activeTab);
const router = useRouter();


const setActive = (tab: string) => {
  activeTab.value = tab;
  store.setActiveTab(tab); // Update the global store
  useWebAppHapticFeedback().impactOccurred("medium");
};

const isActive = (tab: string) => {
  return store.activeTab === tab; // Use the getter from the store
};

// Mapping of tabs to icon paths
const iconMap = {
  main: {
    default: 'https://i.imgur.com/28QwOEJ.png',
    active: 'https://i.imgur.com/7YNwJW6.png'
  },
  tasks: {
    default: 'https://i.imgur.com/caX5tTq.png',
    active: 'https://i.imgur.com/YY52bsh.png'
  },
  frens: {
    default: 'https://i.imgur.com/wuny4py.png',
    active: 'https://i.imgur.com/PSh0U27.png'
  }
};

// Watch for changes in the store's active tab
watch(() => store.activeTab, (newTab) => {
  activeTab.value = newTab;
});
</script>

<style lang="scss">
@import "../assets/style.scss";

.dashboard-container {
  margin-top: 5vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.dashboard {
  background-color: $menuColors;
  border-radius: 15px;
  width: 100%;
  min-height: 3.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

ul {
  display: flex;
  padding: 0;
  list-style-type: none;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

img {
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  transition: filter 0.3s;
}

.option-background {
  min-width: 48px;
  height: 47px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  margin: 0 1.84375rem;
  transition: background-color 0.3s, color 0.3s;
}

.option-background:hover {
  background-color: $secondMenuColor;
}

.option-background.active {
  background-color: $secondMenuColor;
}

a {
  text-decoration: none;
  color: $fontColor;
  opacity: 0.6;
  transition: color 0.3s, opacity 0.3s;
}

.option-background:hover a,
.option-background.active a {
  color: $fontColor;
  opacity: 1;
}
</style>
