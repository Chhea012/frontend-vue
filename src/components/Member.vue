<template>
  <div>
    <h2 class=" text-fuchsia-600">Members</h2>
    <ul>
      <li v-for="member in members" :key="member.id">{{ member.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./axios";

const members = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/members");
    members.value = res.data;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
});
</script>
