<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-extrabold text-gray-900 tracking-tight">Books Management</h2>
      <button
        @click="showBookForm = true; editingBook = null; resetBookForm()"
        class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md flex items-center"
      >
        <i class="bx bx-plus mr-2"></i> Add New Book
      </button>
    </div>

    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Description</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Category</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="book in libraryStore.books" :key="book.id" class="hover:bg-blue-50 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ book.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ book.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ libraryStore.getCategoryName(book.category_id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
              <button
                @click.stop="toggleActions(book.id)"
                class="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <i class="bx bx-dots-vertical-rounded text-2xl"></i>
              </button>
              <div
                v-if="activeMenu === book.id"
                class="absolute right-4 top-12 w-40 bg-white rounded-lg shadow-xl z-20 border border-gray-200 transform translate-y-0 transition-all duration-200"
                ref="dropdown"
              >
                <button
                  @click.stop="viewBook(book)"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                >
                  <i class="bx bx-show mr-2"></i> View
                </button>
                <button
                  @click.stop="editBook(book)"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                >
                  <i class="bx bx-edit mr-2"></i> Edit
                </button>
                <button
                  @click.stop="deleteBook(book.id)"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <i class="bx bx-trash mr-2"></i> Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showBookForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-white p-8 rounded-xl w-full max-w-md transform scale-95 animate-fade-in">
        <h3 class="text-2xl font-semibold mb-6 text-gray-900">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h3>
        <form @submit.prevent="saveBook">
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="bookForm.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter book name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                v-model="bookForm.description"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter description"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="bookForm.category_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select Category</option>
                <option v-for="category in libraryStore.categories" :key="category.id" :value="category.id">
                  {{ category.type }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showBookForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
            >
              <i class="bx bx-x mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 flex items-center"
            >
              <i class="bx bx-save mr-2"></i> {{ editingBook ? 'Update' : 'Add' }} Book
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-95 animate-fade-in">
        <h3 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6 border-b-2 border-blue-600 pb-2">Book Details</h3>
        <div class="space-y-4">
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 animate-slide-in" style="--delay: 0.1s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-book mr-2 text-blue-600"></i> Name
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedBook.name }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 animate-slide-in" style="--delay: 0.2s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-detail mr-2 text-blue-600"></i> Description
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedBook.description }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 animate-slide-in" style="--delay: 0.3s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-category mr-2 text-blue-600"></i> Category
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ libraryStore.getCategoryName(selectedBook.category_id) }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 animate-slide-in" style="--delay: 0.4s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-calendar mr-2 text-blue-600"></i> Created At
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ libraryStore.formatDate(selectedBook.created_at) }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200 animate-slide-in" style="--delay: 0.5s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-calendar-edit mr-2 text-blue-600"></i> Updated At
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ libraryStore.formatDate(selectedBook.updated_at) }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-8">
          <button
            @click="showViewModal = false"
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 flex items-center shadow-md hover:scale-105"
          >
            <i class="bx bx-x mr-2 text-xl"></i> Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'

const libraryStore = useLibraryStore()
const showBookForm = ref(false)
const editingBook = ref(null)
const showViewModal = ref(false)
const selectedBook = ref(null)
const activeMenu = ref(null)

const bookForm = ref({
  name: '',
  description: '',
  category_id: ''
})

const saveBook = async () => {
  try {
    if (editingBook.value) {
      await libraryStore.updateBook(editingBook.value.id, bookForm.value)
    } else {
      await libraryStore.addBook(bookForm.value)
    }
    showBookForm.value = false
    resetBookForm()
  } catch (error) {
    console.error('Failed to save book:', error)
  }
}

const editBook = (book) => {
  editingBook.value = book
  bookForm.value = { 
    name: book.name,
    description: book.description,
    category_id: book.category_id
  }
  showBookForm.value = true
  activeMenu.value = null
}

const deleteBook = async (bookId) => {
  try {
    await libraryStore.deleteBook(bookId)
    activeMenu.value = null
  } catch (error) {
    console.error('Failed to delete book:', error)
  }
}

const viewBook = (book) => {
  selectedBook.value = book
  showViewModal.value = true
  activeMenu.value = null
}

const resetBookForm = () => {
  bookForm.value = {
    name: '',
    description: '',
    category_id: ''
  }
}

const toggleActions = (bookId) => {
  activeMenu.value = activeMenu.value === bookId ? null : bookId
}

const handleOutsideClick = (event) => {
  if (!event.target.closest('.relative')) {
    activeMenu.value = null
  }
}

onMounted(() => {
  if (!libraryStore.books.length) {
    libraryStore.fetchAllData()
  }
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
  animation-delay: var(--delay);
  animation-fill-mode: both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>