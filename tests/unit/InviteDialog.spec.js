import { mount } from '@vue/test-utils'
import InviteDialog from '@/shared/components/dialogs/InviteDialog.vue'

jest.mock('vue-i18n', () => {
  const t = (key) => key

  return {
    createI18n: () => ({ global: { t }, install: jest.fn() }),
    useI18n: () => ({ t }),
  }
})

jest.mock('@/shared/utils/toast', () => ({
  showError: jest.fn(),
  showWarning: jest.fn(),
}))

const passthrough = { template: '<div><slot /></div>' }

const mountDialog = () =>
  mount(InviteDialog, {
    props: { show: true },
    global: {
      stubs: {
        VDialog: passthrough,
        VCard: passthrough,
        VCardTitle: passthrough,
        VCardText: passthrough,
        VRow: passthrough,
        VCol: passthrough,
        VMenu: passthrough,
        VDatePicker: passthrough,
        VTimePicker: passthrough,
        VIcon: passthrough,
        VChip: passthrough,
        VSelect: passthrough,
        VTextarea: passthrough,
        VDivider: passthrough,
        VCardActions: passthrough,
        VSpacer: passthrough,
        VBtn: {
          props: ['disabled'],
          template: '<button :disabled="disabled"><slot /></button>',
        },
        VTextField: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template:
            '<button data-test="clear-email" @click="$emit(\'update:modelValue\', null)">clear</button>',
        },
      },
    },
  })

describe('InviteDialog', () => {
  it('treats the clearable email field null value as an empty string', async () => {
    const wrapper = mountDialog()

    await wrapper.get('[data-test="clear-email"]').trigger('click')

    expect(wrapper.find('button[disabled]').exists()).toBe(true)
  })
})
