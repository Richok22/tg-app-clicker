<!-- src/views/tasks.vue -->
<script setup lang="ts">
import Dashboard from "../components/dashboard.vue";
import Task from "../components/task.vue";
import {useI18n} from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="page-name">
    <div class="page-title">
      <h2>{{ t('tasks') }}</h2>
    </div>
  </div>
  <div class="tasks-container">
    <task />
  </div>
  <dashboard></dashboard>
</template>

<style lang="scss">
@import "../assets/style.scss";

.tasks-container {
  display: flex;
  flex-direction: column; // Stack elements vertically
  align-items: center; // Center items horizontally
  transition: background-color 0.3s, color 0.3s;
  background-color: #1C1C1D;
  border-radius: 15px;
  margin-top: 6vh;
  min-height: 33rem;
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
</style>
