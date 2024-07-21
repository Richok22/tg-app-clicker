<script setup lang="ts">
import {onMounted} from 'vue';
import {useWebApp} from 'vue-tg';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();
const userPlatform = useWebApp().platform;
const userLanguage = useWebApp().initDataUnsafe.user?.language_code;
const router = useRouter();


const changeLanguage = ({lang}: { lang: string }) => {
  locale.value = lang; // Update locale dynamically
};

onMounted(async () => {
  try {
    // Set language based on user data
    if ("ru" === userLanguage) {
      changeLanguage({lang: "ru"});
    } else {
      changeLanguage({lang: "en"});
    }

    // Navigation logic based on platform
    if (userPlatform === 'tdesktop' || userPlatform === 'web' /*|| useWebApp().initDataUnsafe.user?.id === undefined || null */) {
      console.log('Navigating to /restricted');
      await router.push({path: '/restricted'});
    } else {
      console.log('Navigating to /loading');
      await router.push('/loading');
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
});
</script>

<template>
  <suspense>
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </suspense>
</template>

<style scoped>
</style>
