<script setup lang="ts">


// Task structure
import {ref} from "vue";

const friends = ref([
  {
    id: 1,
    username: 'Kinaki',
    balance: '100000'
  },
]);

</script>

<template>
  <div style="margin-top: 4rem" class="friends-container">
    <div v-for="friend in friends" :key="friend.id" class="friend">
      <div class="friend-about">
        <p class="about">{{friend.username}}</p>
        <p style="margin-top: 0.3rem; opacity: 1;" class="about">{{ friend.balance }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/style.scss";

.task {
  margin-top: 1rem;
}

.friends-container {
  margin-top: 1rem; // Space above the info section
  min-height: 2.875rem;
  min-width: 80%; // Set min-width to 80% of container
  max-width: 80%; // Restrict max-width for consistency
  background: rgba(39, 41, 50, 0.6) 30.18%;
  box-shadow: 0px 4px 7.1px -10px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
  text-align: center; // Center text within the info div
  margin-left: auto; // Center the container
  margin-right: auto; // Center the container
}

.friend {
  margin: 0.9rem;
  align-items: center; // Center items vertically
  justify-content: left // Space between the items
}

.friend-about {
  color: $fontColor;
  opacity: 0.6;
  font-size: 13px;
  margin: 0 0.5rem; // Add horizontal margin for spacing
  align-items: center; // Center items vertically
}

.about img {
  margin: 0 0.25rem; // Add small horizontal margins for spacing
}

.arrow {
  margin-left: auto; // This pushes the arrow to the right
}
</style>
