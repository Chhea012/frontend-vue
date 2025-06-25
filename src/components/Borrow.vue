<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold text-fuchsia-500 mb-4">Borrows</h2>
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="borrow in libraryStore.borrows" :key="borrow.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ libraryStore.getBookTitle(borrow.book_id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.getUserName(borrow.user_id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(borrow.start_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(borrow.end_date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ borrow.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                borrow.status === 'Returned' ? 'bg-green-100 text-green-800' :
                borrow.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                new Date(borrow.end_date) < new Date() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ borrow.status === 'Returned' ? 'Returned' :
                   new Date(borrow.end_date) < new Date() ? 'Overdue' : borrow.status }}
              </span>
            </td>
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
  if (!libraryStore.borrows.length) {
    libraryStore.fetchAllData()
  }
})
</script>