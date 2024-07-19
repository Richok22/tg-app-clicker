<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGlobalStore } from "../store/globalStore.ts";
import axios from 'axios';

const avatar = ref<string | null>(null);
const store = useGlobalStore();
/// UZ SERVERU !!!!

// Ensure userId is a valid Telegram user ID (numeric)
const userId = store.userData?.tgId; // Assuming userId is a numeric ID, not username

const botToken = '6197432974:AAH7py0rZyGN5eokA4dPX2YLUF9bhOKwofo'; // Replace with your actual bot token

/// UZ SERVERU !!!!
async function getUserProfilePicture(userId: number): Promise<string | null> {
  try {
    // Step 1: Get user profile photos
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
      params: {
        user_id: userId,
        limit: 1
      }
    });

    const photos = response.data.result.photos;
    if (!photos.length) {
      throw new Error('No profile photos found for this user.');
    }

    // Get the file ID of the highest resolution photo
    const fileId = photos[0][0].file_id;

    // Step 2: Get file path using file ID
    const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile`, {
      params: {
        file_id: fileId
      }
    });

    const filePath = fileResponse.data.result.file_path;

    // Step 3: Construct the file URL
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
    console.log(`User's profile picture link: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error(`Error fetching user profile picture: ${error}`);
    return null;
  }
}

onMounted(async () => {
  if (userId) {
    avatar.value = await getUserProfilePicture(userId);
  }
});
</script>

<template>
  <div class="user-info-container">
    <div class="user-info">
      <div v-if="avatar">
        <img :src="avatar" alt="User's profile picture" class="profile-picture"/>
      </div>
      <p style="margin-left: 23px">{{ store.userData?.username }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/style.scss";

.user-info-container {
  justify-content: left;
  align-items: center;
  display: flex;
}

.user-info {
  background-color: $menuColors;
  border-radius: 15px;
  width: 50%;
  min-height: 2rem;
  display: flex;
  justify-content: left;
  align-items: center;
  filter: drop-shadow(0px 5px 4px #000000);
  font-size: 12px;
}

.profile-picture {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-left: 10px;
}
</style>
