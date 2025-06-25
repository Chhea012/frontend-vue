import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    books: [],
    members: [],
    borrows: [],
    categories: [],
    users: [],
    error: null
  }),

  actions: {
    async fetchAllData() {
      this.error = null
      try {
        const [booksRes, membersRes, borrowsRes, categoriesRes, usersRes] = await Promise.all([
          api.get('/books'),
          api.get('/members'),
          api.get('/borrows'),
          api.get('/categories'),
          api.get('/users')
        ])

        this.books = booksRes.data
        this.members = membersRes.data
        this.borrows = borrowsRes.data
        this.categories = categoriesRes.data
        this.users = usersRes.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch data'
        console.error('Failed to fetch data:', error)
      }
    },

    async addBorrow(borrow) {
      try {
        const response = await api.post('/borrows', borrow)
        this.borrows.push(response.data)
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to add borrow'
        throw error
      }
    },

    async updateBorrow(borrowId, borrow) {
      try {
        const response = await api.put(`/borrows/${borrowId}`, borrow)
        const index = this.borrows.findIndex(b => b.id === borrowId)
        if (index !== -1) {
          this.borrows[index] = response.data
        }
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to update borrow'
        throw error
      }
    },

    async deleteBorrow(borrowId) {
      try {
        await api.delete(`/borrows/${borrowId}`)
        this.borrows = this.borrows.filter(b => b.id !== borrowId)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete borrow'
        throw error
      }
    },

    async returnBook(borrowId) {
      try {
        const response = await api.put(`/borrows/${borrowId}/return`, { status: 'Returned' })
        const index = this.borrows.findIndex(b => b.id === borrowId)
        if (index !== -1) {
          this.borrows[index] = response.data
        }
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to return book'
        throw error
      }
    },

    async addMember(member) {
      try {
        const response = await api.post('/members', member)
        this.members.push(response.data)
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to add member'
        throw error
      }
    },

    async updateMember(memberId, member) {
      try {
        const response = await api.put(`/members/${memberId}`, member)
        const index = this.members.findIndex(m => m.id === memberId)
        if (index !== -1) {
          this.members[index] = response.data
        }
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to update member'
        throw error
      }
    },

    async deleteMember(memberId) {
      try {
        await api.delete(`/members/${memberId}`)
        this.members = this.members.filter(m => m.id !== memberId)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete member'
        throw error
      }
    },

    async addCategory(category) {
      try {
        const response = await api.post('/categories', category)
        this.categories.push(response.data)
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to add category'
        throw error
      }
    },

    async updateCategory(categoryId, category) {
      try {
        const response = await api.put(`/categories/${categoryId}`, category)
        const index = this.categories.findIndex(c => c.id === categoryId)
        if (index !== -1) {
          this.categories[index] = response.data
        }
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to update category'
        throw error
      }
    },

    async deleteCategory(categoryId) {
      try {
        await api.delete(`/categories/${categoryId}`)
        this.categories = this.categories.filter(c => c.id !== categoryId)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete category'
        throw error
      }
    },

    async addBook(book) {
      try {
        const response = await api.post('/books', book)
        this.books.push(response.data)
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to add book'
        throw error
      }
    },

    async updateBook(bookId, book) {
      try {
        const response = await api.put(`/books/${bookId}`, book)
        const index = this.books.findIndex(b => b.id === bookId)
        if (index !== -1) {
          this.books[index] = response.data
        }
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to update book'
        throw error
      }
    },

    async deleteBook(bookId) {
      try {
        await api.delete(`/books/${bookId}`)
        this.books = this.books.filter(b => b.id !== bookId)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete book'
        throw error
      }
    },

    async addUser(user) {
      try {
        const response = await api.post('/users', user)
        this.users.push(response.data)
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to add user'
        throw error
      }
    },

    async updateUser(userId, user) {
      try {
        const response = await api.put(`/users/${userId}`, user)
        const index = this.users.findIndex(u => u.id === userId)
        if (index !== -1) {
          this.users[index] = response.data
        }
        this.error = null
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.message || 'Failed to update user'
        throw error
      }
    },

    async deleteUser(userId) {
      try {
        await api.delete(`/users/${userId}`)
        this.users = this.users.filter(u => u.id !== userId)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.message || 'Failed to delete user'
        throw error
      }
    },

    getBookTitle(bookId) {
      const book = this.books.find(b => b.id === bookId)
      return book ? book.name : 'No Book Assigned'
    },

    getMemberName(memberId) {
      const member = this.members.find(m => m.id === memberId)
      return member ? member.name : 'Unknown'
    },

    getUserName(userId) {
      const user = this.users.find(u => u.id === userId)
      return user ? user.first_name : 'Unknown'
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.type : 'Unknown'
    },

    getBooksInCategory(categoryId) {
      return this.books.filter(b => b.categoryId === categoryId).length
    },

    getMemberBorrowedCount(memberId) {
      return this.borrows.filter(b => b.user_id === memberId && b.status === 'Approved').length
    },

    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A'
    }
  },

  getters: {
    borrowedBooks: state => state.borrows.filter(b => b.status === 'Approved'),
    availableBooks: state => state.books.filter(b => 
      !state.borrows.some(borrow => borrow.book_id === b.id && borrow.status !== 'Returned')
    ),
    totalBorrowedQuantity: state =>
      state.borrows
        .filter(b => b.status === 'Approved')
        .reduce((sum, borrow) => sum + (Number(borrow.quantity) || 0), 0)
  }
})