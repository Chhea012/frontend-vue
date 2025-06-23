<template>
  <aside class="w-64 bg-white shadow-md">
    <div class="p-5 border-b border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800">Library System</h1>
    </div>
    <nav class="mt-5">
      <ul class="space-y-2 px-2">
        <li>
          <router-link
            to="/"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Dashboard' }"
          >
            <span class="mr-2">📈</span> Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            to="/books"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Books' }"
          >
            <span class="mr-2">📕</span> Books
          </router-link>
        </li>
        <li>
          <router-link
            to="/categories"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Categories' }"
          >
            <span class="mr-2">🔖</span> Categories
          </router-link>
        </li>
        <li>
          <router-link
            to="/members"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Members' }"
          >
            <span class="mr-2">🧑‍🤝‍🧑</span> Members
          </router-link>
        </li>
        <li>
          <router-link
            to="/borrowing"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Borrowing' }"
          >
            <span class="mr-2">🔄</span> Borrowing
          </router-link>
        </li>
        <li>
          <router-link
            to="/users"
            class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.name === 'Users' }"
          >
            <span class="mr-2">👤</span> Users
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
</script>