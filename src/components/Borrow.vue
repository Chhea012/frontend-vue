<template>
  <div>
    <h2>Borrows</h2>
    <ul>
      <li v-for="borrow in borrows" :key="borrow.id">
        Quantity: {{ borrow.quantity }} | Status: {{ borrow.status }} | Start: {{ borrow.start_at }} | End: {{ borrow.end_date }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "./axios";

const borrows = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/borrows");
    borrows.value = res.data;
  } catch (error) {
    console.error("Failed to fetch borrows:", error);
  }
});
</script>
