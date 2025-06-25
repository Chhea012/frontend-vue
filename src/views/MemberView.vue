<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gray-800">Members Management</h2>
      <button
        @click="showMemberForm = true; editingMember = null; resetMemberForm()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Member
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="libraryStore.error" class="text-red-500 text-center py-4 mb-4 bg-red-50 rounded-lg">
      Error: {{ libraryStore.error }}
    </div>

    <!-- Members Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editMember(member)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="deleteMember(member.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Member Form Modal -->
    <div v-if="showMemberForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editingMember ? 'Edit Member' : 'Add New Member' }}</h3>
        <form @submit.prevent="saveMember">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="memberForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="memberForm.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                v-model="memberForm.phone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                v-model="memberForm.gender"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Book</label>
              <select
                v-model="memberForm.book_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a book</option>
                <option v-for="book in libraryStore.books" :key="book.id" :value="book.id">{{ book.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showMemberForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ editingMember ? 'Update' : 'Add' }} Member
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
  name: 'MemberView',
  setup() {
    const libraryStore = useLibraryStore()
    const showMemberForm = ref(false)
    const editingMember = ref(null)
    const memberForm = ref({
      name: '',
      email: '',
      phone: '',
      gender: '',
      book_id: ''
    })

    const saveMember = async () => {
      try {
        if (editingMember.value) {
          await libraryStore.updateMember(editingMember.value.id, memberForm.value)
        } else {
          await libraryStore.addMember(memberForm.value)
        }
        showMemberForm.value = false
        resetMemberForm()
      } catch (error) {
        console.error('Failed to save member:', error)
      }
    }

    const editMember = (member) => {
      editingMember.value = member
      memberForm.value = { 
        name: member.name,
        email: member.email,
        phone: member.phone,
        gender: member.gender,
        book_id: member.book_id
      }
      showMemberForm.value = true
    }

    const deleteMember = async (memberId) => {
      if (confirm('Are you sure you want to delete this member?')) {
        try {
          await libraryStore.deleteMember(memberId)
        } catch (error) {
          console.error('Failed to delete member:', error)
        }
      }
    }

    const resetMemberForm = () => {
      memberForm.value = {
        name: '',
        email: '',
        phone: '',
        gender: '',
        book_id: ''
      }
      editingMember.value = null
    }

    // Fetch data on mount if not already loaded
    if (!libraryStore.members.length) {
      libraryStore.fetchAllData()
    }

    return {
      libraryStore,
      showMemberForm,
      editingMember,
      memberForm,
      saveMember,
      editMember,
      deleteMember,
      resetMemberForm
    }
  }
}
</script>