<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-4xl font-extrabold text-black tracking-tight">Users Management</h2>
      <button
        @click="showUserForm = true; editingUser = null; resetUserForm()"
        class="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3  hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md flex items-center"
      >
        <i class="bx bx-plus mr-2"></i> Add New User
      </button>
    </div>

    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">First Name</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Last Name</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
            <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in libraryStore.users" :key="user.id" class="hover:bg-green-50 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.first_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.last_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
              <button
                @click.stop="toggleActions(user.id)"
                class="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <i class="bx bx-dots-vertical-rounded text-2xl"></i>
              </button>
              <div
                v-if="activeMenu === user.id"
                class="absolute right-4 top-12 w-40 bg-white rounded-lg shadow-xl z-20 border border-gray-200 transform translate-y-0 transition-all duration-200"
                ref="dropdown"
              >
                <button
                  @click.stop="viewUser(user)"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                >
                  <i class="bx bx-show mr-2"></i> View
                </button>
                <button
                  @click.stop="editUser(user)"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                >
                  <i class="bx bx-edit mr-2"></i> Edit
                </button>
                <button
                  @click.stop="deleteUser(user.id)"
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

    <div v-if="showUserForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-white p-8 rounded-xl w-full max-w-md transform scale-95 animate-fade-in">
        <h3 class="text-2xl font-semibold mb-6 text-gray-900">{{ editingUser ? 'Edit User' : 'Add New User' }}</h3>
        <form @submit.prevent="saveUser">
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                v-model="userForm.first_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter first name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                v-model="userForm.last_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter last name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter email"
              >
            </div>
            <div v-if="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter password"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showUserForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
            >
              <i class="bx bx-x mr-2"></i> Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 flex items-center"
            >
              <i class="bx bx-save mr-2"></i> {{ editingUser ? 'Update' : 'Add' }} User
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div class="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl w-full max-w-lg shadow-2xl transform scale-95 animate-fade-in">
        <h3 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 mb-6 border-b-2 border-green-600 pb-2">User Details</h3>
        <div class="space-y-4">
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-50 transition-all duration-200 animate-slide-in" style="--delay: 0.1s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-user mr-2 text-green-600"></i> First Name
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedUser.first_name }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-50 transition-all duration-200 animate-slide-in" style="--delay: 0.2s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-user mr-2 text-green-600"></i> Last Name
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedUser.last_name }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-50 transition-all duration-200 animate-slide-in" style="--delay: 0.3s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-envelope mr-2 text-green-600"></i> Email
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedUser.email }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-50 transition-all duration-200 animate-slide-in" style="--delay: 0.4s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-calendar mr-2 text-green-600"></i> Created At
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ libraryStore.formatDate(selectedUser.created_at) }}</p>
          </div>
          <div class="bg-white shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-50 transition-all duration-200 animate-slide-in" style="--delay: 0.5s">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <i class="bx bx-calendar-edit mr-2 text-green-600"></i> Updated At
            </label>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ libraryStore.formatDate(selectedUser.updated_at) }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-8">
          <button
            @click="showViewModal = false"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 flex items-center shadow-md hover:scale-105"
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
const showUserForm = ref(false)
const editingUser = ref(null)
const showViewModal = ref(false)
const selectedUser = ref(null)
const activeMenu = ref(null)

const userForm = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: ''
})

const saveUser = async () => {
  try {
    const userData = {
      first_name: userForm.value.first_name,
      last_name: userForm.value.last_name,
      email: userForm.value.email,
      ...(userForm.value.password && !editingUser.value ? { password: userForm.value.password } : {})
    }
    if (editingUser.value) {
      await libraryStore.updateUser(editingUser.value.id, userData)
    } else {
      await libraryStore.addUser(userData)
    }
    showUserForm.value = false
    resetUserForm()
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: ''
  }
  showUserForm.value = true
  activeMenu.value = null
}

const deleteUser = async (userId) => {
  try {
    await libraryStore.deleteUser(userId)
    activeMenu.value = null
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

const viewUser = (user) => {
  selectedUser.value = user
  showViewModal.value = true
  activeMenu.value = null
}

const resetUserForm = () => {
  userForm.value = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  }
}

const toggleActions = (userId) => {
  activeMenu.value = activeMenu.value === userId ? null : userId
}

const handleOutsideClick = (event) => {
  if (!event.target.closest('.relative')) {
    activeMenu.value = null
  }
}

onMounted(() => {
  if (!libraryStore.users.length) {
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
