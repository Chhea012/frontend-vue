<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Categories Management</h2>
      <button
        @click="showCategoryForm = true; editingCategory = null; resetCategoryForm()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Category
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-red-500 text-center py-4 bg-red-100 p-3 rounded-lg mb-4">
      Error: {{ errorMessage }}
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books Count</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in libraryStore.categories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.type }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div class="max-w-xs truncate" :title="category.description">
                {{ category.description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ libraryStore.getBooksInCategory(category.id) }} books
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editCategory(category)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showCategoryForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h3>
        <form @submit.prevent="saveCategory">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="categoryForm.type"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="categoryForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (optional)</label>
              <input
                v-model="categoryForm.duration"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showCategoryForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ editingCategory ? 'Update' : 'Add' }} Category
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
  name: 'CategoryView',
  setup() {
    const libraryStore = useLibraryStore()
    const showCategoryForm = ref(false)
    const editingCategory = ref(null)
    const errorMessage = ref(null)
    const categoryForm = ref({
      type: '',
      description: '',
      duration: null
    })

    const saveCategory = async () => {
      try {
        const payload = {
          type: categoryForm.value.type,
          description: categoryForm.value.description,
          duration: categoryForm.value.duration || null
        }
        console.log('Saving category with payload:', payload)
        if (editingCategory.value) {
          await libraryStore.updateCategory(editingCategory.value.id, payload)
        } else {
          await libraryStore.addCategory(payload)
        }
        showCategoryForm.value = false
        resetCategoryForm()
        errorMessage.value = null
      } catch (error) {
        console.error('Update error:', error.response?.data || error.message)
        errorMessage.value = error.response?.data?.message || error.message || 'Failed to save category'
      }
    }

    const editCategory = (category) => {
      editingCategory.value = category
      categoryForm.value = {
        type: category.type,
        description: category.description,
        duration: category.duration || null
      }
      showCategoryForm.value = true
      errorMessage.value = null
    }

    const deleteCategory = async (categoryId) => {
      try {
        await libraryStore.deleteCategory(categoryId)
        errorMessage.value = null
      } catch (error) {
        errorMessage.value = error.message || 'Failed to delete category'
      }
    }

    const resetCategoryForm = () => {
      categoryForm.value = {
        type: '',
        description: '',
        duration: null
      }
    }

    return {
      libraryStore,
      showCategoryForm,
      editingCategory,
      categoryForm,
      saveCategory,
      editCategory,
      deleteCategory,
      resetCategoryForm,
      errorMessage
    }
  }
}
</script>