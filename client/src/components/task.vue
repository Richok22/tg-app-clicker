<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWebAppNavigation } from 'vue-tg';
import axios from 'axios'; // Ensure the correct import

/// Uz serveru
const { openTelegramLink } = useWebAppNavigation(); // Destructure the function from useWebAppNavigation
const botToken = '6197432974:AAH7py0rZyGN5eokA4dPX2YLUF9bhOKwofo'; // Replace with your bot token
const channelId = '-1002081419950'; // Replace with your channel ID

const userId = ref(123456789); // Replace with the actual user ID

// Task structure
const tasks = ref([
  {
    id: 1,
    description: 'Follow our telegram channel!',
    completed: false,
    isFollowing: false,
  },
]);

const openLink = () => {
  openTelegramLink('https://t.me/eu_clothes'); // Open the Telegram channel link
};

async function getChatMemberStatus(userId: number): Promise<void> {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getChatMember`, {
      params: {
        chat_id: channelId,
        user_id: userId
      }
    });

    const status = response.data.result.status;
    const following = status === 'member' || status === 'administrator' || status === 'creator';

    // Update task's following status
    tasks.value[0].isFollowing = following;

    // Mark task as completed if following
    tasks.value[0].completed = following;
  } catch (error) {
    console.error('Error checking chat member status:', error);
  }
}

// Call the function on component mount
onMounted(() => {
  getChatMemberStatus(userId.value);
});
</script>

<template>
  <div style="margin-top: 4rem" class="task-container">
    <div v-for="task in tasks" :key="task.id" class="task" @click="task.isFollowing ? null : openLink()">
      <div class="tasks-about">
        <img
            style="margin-top: 0;"
            width="18"
            height="18"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"
            alt="Telegram icon"
        />
        <p class="about">{{ task.completed ? 'Done!' : task.description }}</p>
        <img style="margin-top: 0" v-if="!task.completed" class="arrow" src="https://i.imgur.com/4GbKEj6.png" alt="Arrow icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/style.scss";

.task {
  margin-top: 1rem;
}

.task-container {
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
