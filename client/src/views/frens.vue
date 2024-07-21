<script setup lang="ts">
import { onMounted } from 'vue';
import Dashboard from "../components/dashboard.vue";
import Friend from "../components/friend.vue";
import { useGlobalStore } from '../store/globalStore.ts';
import { useWebAppNavigation } from "vue-tg";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useGlobalStore();
const { openTelegramLink } = useWebAppNavigation();

const openLink = () => {
  const referralCode = store.userData?.referralCode;
  if (referralCode) {
    const botUrl = `https://t.me/joebiden666trapstarbot/app?startapp=${encodeURIComponent(referralCode)}`;
    const text = '💰Catizen: Unleash, Play, Earn - Where Every Game Leads to an Airdrop Adventure!\n🎁Let\'s play-to-earn airdrop right now!';
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${encodeURIComponent(text)}`;
    openTelegramLink(fullUrl);
  } else {
    console.error('Referral code is missing.');
  }
};

</script>

<template>
  <div class="page-name">
    <div class="page-title">
      <h2>{{ t('frens') }}</h2>
    </div>
  </div>
  <div class="frens-container">
    <friend :friends="store.friends" />
  </div>
  <button @click="openLink">{{ t('invite') }}</button>
  <dashboard />
</template>

<style lang="scss">
@import "../assets/style.scss";

.frens-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
