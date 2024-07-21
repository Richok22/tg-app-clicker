<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div>
    <h2 class="main-text">{{ t('restricted') }}</h2>
  </div>

</template>

<style scoped>

.main-text {
  font-size: 25px ;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 40vh;
}
</style>