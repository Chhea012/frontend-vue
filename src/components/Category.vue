<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-fuchsia-500 mb-4">Categories</h2>
    <div v-if="isLoading" class="text-center py-4">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
    <div v-else-if="libraryStore.error" class="text-red-500 text-center py-4 bg-red-100 p-3 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>
    <ul v-else class="space-y-2">
      <li v-for="category in libraryStore.categories" :key="category.id" class="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
        {{ category.type }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useLibraryStore } from '@/stores/libraryStore'
import { onMounted, ref } from 'vue'

const libraryStore = useLibraryStore()
const isLoading = ref(false)

onMounted(async () => {
  if (!libraryStore.categories.length) {
    isLoading.value = true
    try {
      await libraryStore.fetchAllData()
    } catch (error) {
      // Error is handled by the store
    } finally {
      isLoading.value = false
    }
  }
})
</script>