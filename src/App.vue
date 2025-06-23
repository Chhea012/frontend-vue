<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Component -->
    <Aside />

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import Aside from './components/Aside.vue'

export default {
  name: 'App',
  components: {
    Aside
  }
}
</script>