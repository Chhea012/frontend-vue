
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import BookView from '../views/BookView.vue'
import CategoryView from '../views/CategoryView.vue'
import MemberView from '../views/MemberView.vue'
import BorrowView from '../views/BorrowView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/books',
    name: 'Books',
    component: BookView
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryView
  },
  {
    path: '/members',
    name: 'Members',
    component: MemberView
  },
  {
    path: '/borrowing',
    name: 'Borrowing',
    component: BorrowView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
