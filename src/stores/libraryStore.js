
import { reactive, computed } from 'vue'

const state = reactive({
  books: [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      categoryId: 1,
      isbn: '978-0-7432-7356-5',
      available: true
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      categoryId: 1,
      isbn: '978-0-06-112008-4',
      available: false
    },
    {
      id: 3,
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      categoryId: 2,
      isbn: '978-0-262-03384-8',
      available: true
    }
  ],
  
  categories: [
    {
      id: 1,
      name: 'Fiction',
      description: 'Fictional literature and novels'
    },
    {
      id: 2,
      name: 'Computer Science',
      description: 'Programming, algorithms, and technology books'
    },
    {
      id: 3,
      name: 'History',
      description: 'Historical books and biographies'
    }
  ],
  
  members: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      joinDate: '2024-02-20'
    }
  ],
  
  borrowedBooks: [
    {
      id: 1,
      bookId: 2,
      memberId: 1,
      borrowDate: '2024-06-01',
      dueDate: '2024-06-15',
      returned: false
    }
  ]
})

export function useLibraryStore() {
  // Computed properties
  const availableBooks = computed(() => {
    return state.books.filter(book => book.available)
  })

  // Helper methods
  const getCategoryName = (categoryId) => {
    const category = state.categories.find(c => c.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const getBookTitle = (bookId) => {
    const book = state.books.find(b => b.id === bookId)
    return book ? book.title : 'Unknown'
  }

  const getMemberName = (memberId) => {
    const member = state.members.find(m => m.id === memberId)
    return member ? member.name : 'Unknown'
  }

  const getBooksInCategory = (categoryId) => {
    return state.books.filter(b => b.categoryId === categoryId).length
  }

  const getMemberBorrowedCount = (memberId) => {
    return state.borrowedBooks.filter(b => b.memberId === memberId && !b.returned).length
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Book methods
  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      available: true
    }
    state.books.push(newBook)
  }

  const updateBook = (bookId, bookData) => {
    const index = state.books.findIndex(b => b.id === bookId)
    if (index !== -1) {
      state.books[index] = { ...state.books[index], ...bookData }
    }
  }

  const deleteBook = (bookId) => {
    state.books = state.books.filter(b => b.id === bookId)
  }

  // Category methods
  const addCategory = (categoryData) => {
    const newCategory = {
      id: Date.now(),
      ...categoryData
    }
    state.categories.push(newCategory)
  }

  const updateCategory = (categoryId, categoryData) => {
    const index = state.categories.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      state.categories[index] = { ...state.categories[index], ...categoryData }
    }
  }

  const deleteCategory = (categoryId) => {
    state.categories = state.categories.filter(c => c.id !== categoryId)
  }

  // Member methods
  const addMember = (memberData) => {
    const newMember = {
      id: Date.now(),
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0]
    }
    state.members.push(newMember)
  }

  const updateMember = (memberId, memberData) => {
    const index = state.members.findIndex(m => m.id === memberId)
    if (index !== -1) {
      state.members[index] = { ...state.members[index], ...memberData }
    }
  }

  const deleteMember = (memberId) => {
    state.members = state.members.filter(m => m.id !== memberId)
  }

  // Borrowing methods
  const addBorrow = (borrowData) => {
    const newBorrow = {
      id: Date.now(),
      ...borrowData,
      borrowDate: new Date().toISOString().split('T')[0],
      returned: false
    }
    state.borrowedBooks.push(newBorrow)
    
    // Mark book as unavailable
    const book = state.books.find(b => b.id == borrowData.bookId)
    if (book) {
      book.available = false
    }
  }

  const returnBook = (borrowId) => {
    const borrow = state.borrowedBooks.find(b => b.id === borrowId)
    if (borrow) {
      borrow.returned = true
      borrow.returnDate = new Date().toISOString().split('T')[0]
      
      // Mark book as available
      const book = state.books.find(b => b.id === borrow.bookId)
      if (book) {
        book.available = true
      }
    }
  }

  return {
    // State
    books: state.books,
    categories: state.categories,
    members: state.members,
    borrowedBooks: state.borrowedBooks,
    
    // Computed
    availableBooks,
    
    // Helper methods
    getCategoryName,
    getBookTitle,
    getMemberName,
    getBooksInCategory,
    getMemberBorrowedCount,
    formatDate,
    
    // CRUD methods
    addBook,
    updateBook,
    deleteBook,
    addCategory,
    updateCategory,
    deleteCategory,
    addMember,
    updateMember,
    deleteMember,
    addBorrow,
    returnBook
  }
}
