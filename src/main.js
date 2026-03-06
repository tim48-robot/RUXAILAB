import { createApp } from 'vue';
import App from './app/App.vue';
import router from './app/router/index.js';
import store from './store';
import vuetify from './app/plugins/vuetify.js';
import i18n from './app/plugins/i18n';
import Toast, { useToast } from 'vue-toastification';
import TextClamp from 'vue3-text-clamp';
import { quillEditor } from 'vue3-quill'
import 'vue-toastification/dist/index.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App);

// Preserve HTML comments in rendered DOM so Figma html-to-design plugin
// reads them as clean layer names instead of raw HTML tag names
app.config.compilerOptions.comments = true;

const options = {
  newestOnTop: true,
  position: 'top-right',
  draggable: true,
  pauseOnHover: true,
  closeOnClick: true,
  timeout: 4000,
};

// Use plugins
app.use(router);
app.use(store);
app.use(vuetify);
app.use(i18n);
app.use(Toast, options);
app.use(TextClamp);
app.use(quillEditor)

app.config.globalProperties.$toast = useToast();

// Mount the app
app.mount('#app');

// ── Figma Layer Name Fixer ───────────────────────────────────────────────────
// Vuetify generates ~20 internal DOM elements with class names like
// "v-btn__overlay", "v-toolbar__content", "v-field__prepend-inner", etc.
// We cannot add Vue template comments to these since Vuetify creates them.
// This mapper runs ONCE after mount (+ on dynamic DOM changes) and assigns
// clean, human-readable IDs ONLY to those exact known internal Vuetify classes.
// It NEVER overwrites elements that already have an id.
const VUETIFY_CLASS_NAMES = {
  // Toolbar / App Bar
  'v-toolbar__content':       'Toolbar Content',
  'v-toolbar__extension':     'Toolbar Extension',
  // Buttons
  'v-btn__overlay':           'Button Overlay',
  'v-btn__content':           'Button Content',
  'v-btn__underlay':          'Button Underlay',
  // Select / Input Fields
  'v-field__field':           'Field Input Area',
  'v-field__prepend-inner':   'Field Prepend Icon Area',
  'v-field__append-inner':    'Field Append Icon Area',
  'v-field__outline':         'Field Outline',
  'v-field__input':           'Field Input',
  'v-field__clearable':       'Field Clear Button',
  'v-field__loader':          'Field Loader',
  'v-input__details':         'Input Details',
  'v-input__control':         'Input Control',
  'v-select__selection':      'Select Selection Text',
  'v-select__selection-text': 'Select Selection Text',
  'v-label':                  'Field Label',
  // Lists
  'v-list-item__overlay':     'List Item Overlay',
  'v-list-item__content':     'List Item Content',
  'v-list-item__prepend':     'List Item Prepend Icon',
  'v-list-item__append':      'List Item Append Icon',
  // Navigation Drawer
  'v-navigation-drawer__content':    'Sidebar Content',
  'v-navigation-drawer__scrim':      'Sidebar Scrim',
  // Avatar
  'v-avatar__image':          'Avatar Image',
  // Card
  'v-card__image':            'Card Image',
  // Badge
  'v-badge__badge':           'Badge Counter',
  // Divider
  'v-divider':                'Divider',
  // Responsive container
  'v-responsive__content':    'Responsive Content',
  'v-responsive__sizer':      'Responsive Sizer',
};

// Counter to guarantee every instance gets a unique id
const _idCounts = {};

function labelVuetifyInternals() {
  Object.entries(VUETIFY_CLASS_NAMES).forEach(([cls, label]) => {
    document.querySelectorAll(`.${cls}:not([id])`).forEach(el => {
      _idCounts[label] = (_idCounts[label] || 0) + 1;
      el.id = _idCounts[label] === 1 ? label : `${label} ${_idCounts[label]}`;
    });
  });
}

// Run once on initial render (slight delay lets Vuetify finish rendering)
setTimeout(labelVuetifyInternals, 500);

// Re-run whenever DOM changes (catches menus, dialogs, lazy-loaded components)
const _observer = new MutationObserver(() => labelVuetifyInternals());
_observer.observe(document.body, { childList: true, subtree: true });
