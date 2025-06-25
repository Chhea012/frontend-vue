<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Borrowing Management</h2>
      <button
        @click="showBorrowForm = true; editingBorrow = null; resetBorrowForm()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        New Borrowing
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 mb-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>

    <!-- Borrowing Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                v-if="borrow.status !== 'Returned'"
                @click="editBorrow(borrow)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                v-if="borrow.status !== 'Returned'"
                @click="returnBook(borrow.id)"
                class="text-green-600 hover:text-green-900"
              >
                Return
              </button>
              <button
                @click="deleteBorrow(borrow.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Borrow Form Modal -->
    <div v-if="showBorrowForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editingBorrow ? 'Edit Borrowing' : 'New Borrowing' }}</h3>
        <form @submit.prevent="saveBorrow">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Book</label>
              <select
                v-model="borrowForm.book_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Book</option>
                <option v-for="book in libraryStore.availableBooks" :key="book.id" :value="book.id">
                  {{ book.name }} - {{ book.author || 'Unknown Author' }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select
                v-model="borrowForm.user_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select User</option>
                <option v-for="user in libraryStore.users" :key="user.id" :value="user.id">
                  {{ user.first_name }} - {{ user.email }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Borrow Date</label>
              <input
                v-model="borrowForm.start_at"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                v-model="borrowForm.end_date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                v-model.number="borrowForm.quantity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="borrowForm.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Returned">Returned</option>
              </select>
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
              {{ editingBorrow ? 'Update' : 'Create' }} Borrowing
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
    const editingBorrow = ref(null)
    const borrowForm = ref({
      book_id: '',
      user_id: '',
      start_at: '',
      end_date: '',
      quantity: 1,
      status: 'Pending'
    })

    const saveBorrow = async () => {
      try {
        if (editingBorrow.value) {
          await libraryStore.updateBorrow(editingBorrow.value.id, borrowForm.value)
        } else {
          await libraryStore.addBorrow(borrowForm.value)
        }
        showBorrowForm.value = false
        resetBorrowForm()
      } catch (error) {
        console.error('Failed to save borrow:', error)
      }
    }

    const editBorrow = (borrow) => {
      editingBorrow.value = borrow
      borrowForm.value = {
        book_id: borrow.book_id,
        user_id: borrow.user_id,
        start_at: borrow.start_at.split('T')[0],
        end_date: borrow.end_date.split('T')[0],
        quantity: borrow.quantity,
        status: borrow.status
      }
      showBorrowForm.value = true
    }

    const returnBook = async (borrowId) => {
      if (confirm('Are you sure you want to mark this book as returned?')) {
        try {
          await libraryStore.returnBook(borrowId)
        } catch (error) {
          console.error('Failed to return book:', error)
        }
      }
    }

    const deleteBorrow = async (borrowId) => {
      if (confirm('Are you sure you want to delete this borrowing record?')) {
        try {
          await libraryStore.deleteBorrow(borrowId)
        } catch (error) {
          console.error('Failed to delete borrow:', error)
        }
      }
    }

    const resetBorrowForm = () => {
      borrowForm.value = {
        book_id: '',
        user_id: '',
        start_at: '',
        end_date: '',
        quantity: 1,
        status: 'Pending'
      }
      editingBorrow.value = null
    }

    // Fetch data on mount if not already loaded
    if (!libraryStore.borrows.length) {
      libraryStore.fetchAllData()
    }

    return {
      libraryStore,
      showBorrowForm,
      editingBorrow,
      borrowForm,
      saveBorrow,
      editBorrow,
      returnBook,
      deleteBorrow,
      resetBorrowForm
    }
  }
}
</script>