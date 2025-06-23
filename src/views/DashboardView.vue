<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
    
    <div v-if="libraryStore.error" class="text-red-500 text-center py-8">
      Error: {{ libraryStore.error }}
    </div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <span class="text-2xl">📚</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Books</p>
              <p class="text-2xl font-bold text-gray-800">{{ libraryStore.books.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Members</p>
              <p class="text-2xl font-bold text-gray-800">{{ libraryStore.members.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <span class="text-2xl">📖</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Borrowed Quantity</p>
              <p class="text-2xl font-bold text-gray-800">{{ libraryStore.totalBorrowedQuantity }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
              <span class="text-2xl">🏷️</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Categories</p>
              <p class="text-2xl font-bold text-gray-800">{{ libraryStore.categories.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-full">
              <span class="text-2xl">👤</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-800">{{ libraryStore.users.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h3 class="text-xl font-semibold text-gray-800">Recent Borrowing Activities</h3>
        </div>
        <div class="p-6">
          <div v-if="libraryStore.borrowedBooks.length === 0" class="text-gray-500 text-center py-4">
            No borrowing activities yet
          </div>
          <div v-else class="space-y-4">
            <div v-for="borrow in libraryStore.borrowedBooks.slice(0, 5)" :key="borrow.id" 
                 class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-800">{{ libraryStore.getBookTitle(borrow.book_id) }}</p>
                <p class="text-sm text-gray-600">Borrowed by {{ libraryStore.getMemberName(borrow.user_id) }}</p>
              </div>
              <div class="text-sm text-gray-500">
                {{ libraryStore.formatDate(borrow.start_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLibraryStore } from '@/stores/libraryStore'
import { onMounted } from 'vue'

const libraryStore = useLibraryStore()

onMounted(() => {
  libraryStore.fetchAllData()
})
</script>