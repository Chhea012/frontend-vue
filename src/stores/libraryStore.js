import { defineStore } from 'pinia'
import api from '@/components/axios'

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
        this.error = error.message
        console.error('Failed to fetch data:', error)
      }
    },

    async addBook(book) {
      try {
        const response = await api.post('/books', book)
        this.books.push(response.data)
      } catch (error) {
        throw new Error('Failed to add book: ' + error.message)
      }
    },

    async updateBook(bookId, book) {
      try {
        const response = await api.put(`/books/${bookId}`, book)
        const index = this.books.findIndex(b => b.id === bookId)
        if (index !== -1) {
          this.books[index] = response.data
        }
      } catch (error) {
        throw new Error('Failed to update book: ' + error.message)
      }
    },

    async deleteBook(bookId) {
      try {
        await api.delete(`/books/${bookId}`)
        this.books = this.books.filter(b => b.id !== bookId)
      } catch (error) {
        throw new Error('Failed to delete book: ' + error.message)
      }
    },

    getBookTitle(bookId) {
      const book = this.books.find(b => b.id === bookId)
      return book ? book.name : 'Unknown'
    },

    getMemberName(memberId) {
      const member = this.members.find(m => m.id === memberId)
      return member ? member.name : 'Unknown'
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.type : 'Unknown'
    },

    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    }
  },

  getters: {
    borrowedBooks: state => state.borrows.filter(b => b.status === 'approved'),
    totalBorrowedQuantity: state => state.borrows
      .filter(b => b.status === 'approved')
      .reduce((sum, borrow) => sum + (Number(borrow.quantity) || 0), 0)
  }
})