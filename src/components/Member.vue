<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-fuchsia-500 mb-4">Members</h2>
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="member in libraryStore.members" :key="member.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.gender }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(member.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.getBookTitle(member.book_id) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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