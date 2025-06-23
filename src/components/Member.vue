<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-fuchsia-500 mb-4">Members</h2>
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4">
      Error: {{ libraryStore.error }}
    </div>
    <ul v-else class="space-y-2">
      <li v-for="member in libraryStore.members" :key="member.id" class="p-2 bg-gray-50 rounded">
        {{ member.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useLibraryStore } from '@/stores/libraryStore'
import { onMounted } from 'vue'

const libraryStore = useLibraryStore()

onMounted(() => {
  if (!libraryStore.members.length) {
    libraryStore.fetchAllData()
  }
})
</script>