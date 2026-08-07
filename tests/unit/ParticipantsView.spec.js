import { flushPromises, shallowMount } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ParticipantsView from '@/shared/views/ParticipantsView.vue'
import { showError } from '@/shared/utils/toast'

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(),
}))

jest.mock('vuex', () => ({
  useStore: jest.fn(),
}))

jest.mock('vue-i18n', () => {
  const t = (key) => key

  return {
    createI18n: () => ({ global: { t }, install: jest.fn() }),
    useI18n: () => ({ t }),
  }
})

jest.mock('@/shared/utils/toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn(),
}))

describe('ParticipantsView', () => {
  it('contains participant-loading permission failures instead of creating an unhandled rejection', async () => {
    const permissionError = new Error('Missing or insufficient permissions.')
    const store = {
      dispatch: jest.fn((action) => {
        if (action === 'getStudyParticipants') {
          return Promise.reject(permissionError)
        }
        return Promise.resolve(undefined)
      }),
      getters: {
        test: { id: 'study-1', testAdmin: { email: 'owner@example.com' } },
        user: { id: 'owner', email: 'owner@example.com' },
        participants: [],
        loading: false,
        getDialogLeaveStatus: false,
      },
      state: { Users: { users: [] } },
    }

    useStore.mockReturnValue(store)
    useRoute.mockReturnValue({ params: { id: 'study-1' } })
    useRouter.mockReturnValue({})

    shallowMount(ParticipantsView, {
      global: {
        mocks: { $t: (key) => key },
        stubs: {
          VBtn: true,
          VDialog: true,
          VIcon: true,
          VList: true,
          VListItem: true,
          VListItemTitle: true,
          VMenu: true,
        },
      },
    })

    await flushPromises()

    expect(showError).toHaveBeenCalledWith('errors.globalError')
  })
})
