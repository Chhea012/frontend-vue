<template>
  <div>
    <h2 class=" text-fuchsia-500">Categories</h2>
    <ul>
      <li v-for="category in categories" :key="category.id">{{ category.type }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./axios";

const categories = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/categories");
    categories.value = res.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
});
</script>
