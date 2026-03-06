<template>
  <!-- Top Bar -->
  <v-app-bar id="Top Bar" density="comfortable" color="#00213F" padding="10px !important">
    <!-- Menu Icon -->
    <v-btn
      id="Menu Icon"
      v-if="user"
      icon
      class="d-flex d-lg-none"
      @click="toggleDashboardDrawer"
    >
      <!-- Hamburger Icon --><v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Logo -->
    <v-toolbar-title
      id="Logo Container"
      style="cursor: pointer"
      class="d-flex align-center"
      @click="goTo('/admin')"
    >
      <!-- Logo Image -->
      <img
        :src="xs ? logoSmall : logoFull"
        alt="RUXAILAB Logo"
        :height="xs ? '30' : '25'"
        :class="xs ? 'mr-1 align-self-center' : 'mr-3 align-self-center'"
        style="vertical-align: middle"
      />
    </v-toolbar-title>

    <!-- Spacer -->
    <v-spacer id="Spacer" />

    <!-- Language Selector -->
    <locale-changer id="Language Selector" />

    <!-- Go to Console Button -->
    <v-btn
      v-if="$route.path === '/' && user"
      variant="text"
      color="#f9a826"
      class="console-button mx-1 d-none d-lg-flex"
      @click="goTo('/admin')"
    >
      {{ $t('buttons.goToConsole') }}
    </v-btn>

    <!-- Go Home Button -->
    <v-btn
      v-if="['/admin', '/signin', '/signup'].includes($route.path)"
      variant="text"
      color="#f9a826"
      class="console-button mx-1 d-none d-lg-flex"
      @click="goTo('/')"
    >
      {{ $t('AccessNotAllowed.goHome') }}
    </v-btn>

    <!-- Return to Console Button -->
    <v-btn
      id="Return to Console Button"
      v-if="!['/', '/admin', '/signin', '/signup'].includes($route.path)"
      variant="text"
      color="#f9a826"
      class="console-button mx-1 d-none d-lg-flex"
      @click="goTo('/admin')"
    >
      {{ $t('buttons.returnToConsole') }}
    </v-btn>

    <!-- Help Button -->
    <HelpButton id="Help Button" :class="smAndDown ? 'mx-1' : 'mx-2'" />
    <!-- Notifications Button -->
    <NotificationButton id="Notifications Button" v-if="user" :class="smAndDown ? 'mx-1' : 'mx-2'" />

    <!-- User Avatar Menu -->
    <UserMenu id="User Avatar Menu" v-if="user" />
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useDisplay } from 'vuetify'
import LocaleChanger from '@/features/language/components/LocaleChanger.vue'
import HelpButton from '@/features/navigation/components/HelpButton.vue'
import UserMenu from './UserMenu.vue'
import NotificationButton from './NotificationButton.vue'
import logoFull from '@/assets/logo_full_white.png'
import logoSmall from '@/assets/logo_small_red.png'

// Emits
defineEmits(['toggle-mobile-drawer', 'toggle-dashboard-drawer'])

// Composables
const router = useRouter()
const store = useStore()
const { smAndDown, xs } = useDisplay()

// Computed
const user = computed(() => store.getters.user)
const iconSize = computed(() => (smAndDown.value ? '18' : '20'))

// Methods
const goTo = (path) => {
  if (path.includes('/testview')) {
    window.open(path)
  } else {
    router.push(path).catch(() => {})
  }
}

const toggleDashboardDrawer = () => {
  // Emitir evento para que lo capture el layout o componente padre
  const event = new CustomEvent('toggle-dashboard-drawer')
  window.dispatchEvent(event)
}
</script>

<style scoped>
.console-button {
  text-transform: none !important;
  letter-spacing: normal !important;
}

:deep(.v-toolbar__content) {
  padding-right: 20px;
  padding-left: 10px;
}

@media (max-width: 600px) {
  :deep(.v-toolbar__content) {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
