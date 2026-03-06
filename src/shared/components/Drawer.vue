<template>
  <!-- Sidebar Navigation -->
  <v-navigation-drawer
    id="Sidebar Navigation"
    v-model="drawerOpen"
    :rail="miniMode && mdAndUp"
    :temporary="!mdAndUp"
    :permanent="mdAndUp"
    color="primary"
    class="pt-3"
  >
    <!-- Navigation Options -->
    <v-list id="Navigation Options" v-if="items" density="compact">
      <!-- Nav Item -->
      <v-list-item :id="'Nav Item ' + item.title" v-for="(item, n) in items" :key="n" @click="go(item)">
        <template #prepend>
          <!-- Nav Item Icon -->
          <v-icon :color="$route.path == item.path ? '#fca326' : '#bababa'">
            {{ item.icon }}
          </v-icon>
        </template>
        <!-- Nav Item Label -->
        <v-list-item-title
          :style="$route.path == item.path ? 'color: #fca326' : 'color:#bababa'"
        >
          {{ $t(`titles.drawer.${item.title}`) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Sidebar Footer -->
    <div id="Sidebar Footer" v-if="mdAndUp" class="footer">
      <!-- Collapse Toggle -->
      <v-btn
        id="Collapse Toggle"
        icon
        size="small"
        class="mr-2 bg-orange"
        @click.stop="toggleMiniMode"
      >
        <!-- Collapse Icon -->
        <v-icon color="white">
          {{ miniMode ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
        </v-icon>
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const store = useStore()
const router = useRouter()
const route = useRoute()
const { mdAndUp, mobile } = useDisplay()

const drawerOpen = ref(false)
const miniMode = ref(false)
const test = computed(() => store.state.Tests.Test)

const initialDrawerState = computed(() => {
  return mdAndUp.value
})

onMounted(() => {
  drawerOpen.value = initialDrawerState.value
})

const go = (item) => {
  if (!item?.path) return
  if (route.path === item.path) return
  const testId = test.value?.id
  if (testId && item.path === `/testview/${testId}`)
    return window.open(item.path)
  router.push(item.path)
  if (mobile.value) {
    drawerOpen.value = false
  }
}

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}
const toggleMiniMode = () => {
  miniMode.value = !miniMode.value
}

onMounted(() => {
  globalThis.addEventListener('toggle-dashboard-drawer', toggleDrawer)
})

onUnmounted(() => {
  globalThis.removeEventListener('toggle-dashboard-drawer', toggleDrawer)
})
</script>

<style scoped>
.footer {
  position: absolute;
  bottom: 10px;
  width: auto;
  padding: 10px;
}
</style>
