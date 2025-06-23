<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Books Management</h2>
      <button
        @click="showBookForm = true; editingBook = null; resetBookForm()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Book
      </button>
    </div>

    <!-- Books Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="book in libraryStore.books" :key="book.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ book.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.author }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.getCategoryName(book.categoryId) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ book.isbn }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ book.available ? 'Available' : 'Borrowed' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editBook(book)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="deleteBook(book.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Book Form Modal -->
    <div v-if="showBookForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
        <form @submit.prevent="saveBook">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="bookForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                v-model="bookForm.author"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="bookForm.categoryId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option v-for="category in libraryStore.categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                v-model="bookForm.isbn"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showBookForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ editingBook ? 'Update' : 'Add' }} Book
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
  name: 'BookView',
  setup() {
    const libraryStore = useLibraryStore()
    const showBookForm = ref(false)
    const editingBook = ref(null)
    const bookForm = ref({
      title: '',
      author: '',
      categoryId: '',
      isbn: ''
    })

    const saveBook = () => {
      if (editingBook.value) {
        libraryStore.updateBook(editingBook.value.id, bookForm.value)
      } else {
        libraryStore.addBook(bookForm.value)
      }
      showBookForm.value = false
      resetBookForm()
    }

    const editBook = (book) => {
      editingBook.value = book
      bookForm.value = { ...book }
      showBookForm.value = true
    }

    const deleteBook = (bookId) => {
      if (confirm('Are you sure you want to delete this book?')) {
        libraryStore.deleteBook(bookId)
      }
    }

    const resetBookForm = () => {
      bookForm.value = {
        title: '',
        author: '',
        categoryId: '',
        isbn: ''
      }
    }

    return {
      libraryStore,
      showBookForm,
      editingBook,
      bookForm,
      saveBook,
      editBook,
      deleteBook,
      resetBookForm
    }
  }
}
</script>