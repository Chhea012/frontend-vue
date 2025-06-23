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

    <!-- Members Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books Borrowed</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="member in libraryStore.members" :key="member.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.formatDate(member.joinDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ libraryStore.getMemberBorrowedCount(member.id) }}</td>
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
      phone: ''
    })

    const saveMember = () => {
      if (editingMember.value) {
        libraryStore.updateMember(editingMember.value.id, memberForm.value)
      } else {
        libraryStore.addMember(memberForm.value)
      }
      showMemberForm.value = false
      resetMemberForm()
    }

    const editMember = (member) => {
      editingMember.value = member
      memberForm.value = { ...member }
      showMemberForm.value = true
    }

    const deleteMember = (memberId) => {
      if (confirm('Are you sure you want to delete this member?')) {
        libraryStore.deleteMember(memberId)
      }
    }

    const resetMemberForm = () => {
      memberForm.value = {
        name: '',
        email: '',
        phone: ''
      }
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