<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {defineProps} from 'vue';
import {useWebApp} from "vue-tg";
let userLanguage = useWebApp().initDataUnsafe.user?.language_code;
console.log(userLanguage)
let en = "en"
let ru = "ru"

if (userLanguage === undefined) {
  userLanguage = en;
}

const { t } = useI18n();
defineProps<{
  tasks: { taskId: number; TaskName_en: string; TaskName_ru: string; type: string; link: string;}[];
}>();



</script>

<template>
    <div v-for="task in tasks" :key="task.taskId" class="task">
      <div class="tasks-about">
        <img
            style="margin-top: 0;"
            width="18"
            height="18"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"
            alt="Telegram icon"
        />
        <p class="about" v-if="userLanguage === en">{{task.TaskName_en}}</p>
        <p class="about" v-if="userLanguage === ru">{{task.TaskName_ru}}</p>
        <img style="margin-top: 0" class="arrow" src="https://i.imgur.com/4GbKEj6.png" alt="Arrow icon" />
      </div>
    </div>
</template>

<style lang="scss">
@import "../assets/style.scss";

.task {
  margin-top: 1rem;
  margin-top: 1rem; // Space above the info section
  min-height: 2.875rem;
  min-width: 80%; // Set min-width to 80% of container
  max-width: 80%; // Restrict max-width for consistency
  background: linear-gradient(130deg, #0098EA -98.39%, rgba(39, 41, 50, 0.6) 30.18%);
  box-shadow: 0px 4px 7.1px -10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center; // Center text within the info div
  margin-left: auto; // Center the container
  margin-right: auto; // Center the container
}


.tasks-about {
  margin: 0.9rem;
  display: flex;
  align-items: center; // Center items vertically
  justify-content: space-between; // Space between the items
}

.about {
  color: $fontColor;
  opacity: 0.6;
  font-size: 13px;
  margin: 0 0.5rem; // Add horizontal margin for spacing
  display: flex; // Enable flexbox on .about
  align-items: center; // Center items vertically
}

.about img {
  margin: 0 0.25rem; // Add small horizontal margins for spacing
}

.arrow {
  margin-left: auto; // This pushes the arrow to the right
}
</style>
