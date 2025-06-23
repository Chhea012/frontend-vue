<template>
  <div>
    <h2>Users</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.first_name }} {{ user.last_name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./axios";

const users = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
});
</script>
