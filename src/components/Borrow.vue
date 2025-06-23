<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-fuchsia-500 mb-4">Borrows</h2>
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4">
      Error: {{ libraryStore.error }}
    </div>
    <ul v-else class="space-y-2">
      <li
        v-for="borrow in libraryStore.borrows"
        :key="borrow.id"
        class="p-2 bg-gray-50 rounded"
      >
        <div class="font-semibold text-gray-800">
          {{ libraryStore.getBookTitle(borrow.book_id) }} borrowed by
          {{ libraryStore.getUserName(borrow.user_id) }}
        </div>
        <div class="text-sm text-gray-600">
          Quantity: {{ borrow.quantity }} |
          Status: {{ borrow.status }} |
          Start: {{ libraryStore.formatDate(borrow.start_at) }} |
          End: {{ libraryStore.formatDate(borrow.end_date) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useLibraryStore } from '@/stores/libraryStore'
import { onMounted } from 'vue'

const libraryStore = useLibraryStore()

onMounted(() => {
  if (!libraryStore.borrows.length) {
    libraryStore.fetchAllData()
  }
})
</script>
