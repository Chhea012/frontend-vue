<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Borrowing Management</h2>
      <button
        @click="showBorrowForm = true; resetBorrowForm()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        New Borrowing
      </button>
    </div>

    <!-- Borrowing Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="borrow in libraryStore.borrowedBooks" :key="borrow.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ libraryStore.getBookTitle(borrow.bookId) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.getMemberName(borrow.memberId) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(borrow.borrowDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(borrow.dueDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                borrow.returned ? 'bg-green-100 text-green-800' : 
                (new Date(borrow.dueDate) < new Date() ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')
              ]">
                {{ borrow.returned ? 'Returned' : (new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active') }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                v-if="!borrow.returned"
                @click="returnBook(borrow.id)"
                class="text-green-600 hover:text-green-900"
              >
                Return Book
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Borrow Form Modal -->
    <div v-if="showBorrowForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">New Borrowing</h3>
        <form @submit.prevent="saveBorrow">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Book</label>
              <select
                v-model="borrowForm.bookId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Book</option>
                <option v-for="book in libraryStore.availableBooks" :key="book.id" :value="book.id">
                  {{ book.title }} - {{ book.author }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Member</label>
              <select
                v-model="borrowForm.memberId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Member</option>
                <option v-for="member in libraryStore.members" :key="member.id" :value="member.id">
                  {{ member.name }} - {{ member.email }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                v-model="borrowForm.dueDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showBorrowForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Borrowing
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useLibraryStore } from '../stores/libraryStore.js'

export default {
  name: 'BorrowView',
  setup() {
    const libraryStore = useLibraryStore()
    const showBorrowForm = ref(false)
    const borrowForm = ref({
      bookId: '',
      memberId: '',
      dueDate: ''
    })

    const saveBorrow = () => {
      libraryStore.addBorrow(borrowForm.value)
      showBorrowForm.value = false
      resetBorrowForm()
    }

    const returnBook = (borrowId) => {
      libraryStore.returnBook(borrowId)
    }

    const resetBorrowForm = () => {
      borrowForm.value = {
        bookId: '',
        memberId: '',
        dueDate: ''
      }
    }

    return {
      libraryStore,
      showBorrowForm,
      borrowForm,
      saveBorrow,
      returnBook,
      resetBorrowForm
    }
  }
}
</script>