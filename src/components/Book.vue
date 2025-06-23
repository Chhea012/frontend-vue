<template>
  <div>
    <h2 class=" text-fuchsia-500">Books</h2>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./axios";

const books = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/books");
    books.value = res.data;
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
});
</script>
