jest.mock('@/features/auth/controllers/AuthController', () => {
  return jest.fn().mockImplementation(() => ({}))
})

jest.mock('@/features/auth/controllers/UserController', () => {
  return jest.fn().mockImplementation(() => ({}))
})

import AuthModule from '@/features/auth/store/Auth'

describe('Auth store getters', () => {
  describe('getUserAccessLevel', () => {
    const buildGetter = (user) =>
      AuthModule.getters.getUserAccessLevel({
        user,
      })

    it('returns cooperator access level only when invitation is accepted', () => {
      const getter = buildGetter({ id: 'user-1', accessLevel: 2 })

      const test = {
        testAdmin: { userDocId: 'owner-1' },
        isPublic: false,
        cooperators: [
          {
            userDocId: 'user-1',
            accessLevel: 1,
            accepted: true,
          },
        ],
      }

      expect(getter(test)).toBe(1)
    })

    it('does not grant cooperator access level when invitation is pending/rejected', () => {
      const getter = buildGetter({ id: 'user-1', accessLevel: 2 })

      const privateTest = {
        testAdmin: { userDocId: 'owner-1' },
        isPublic: false,
        cooperators: [
          {
            userDocId: 'user-1',
            accessLevel: 1,
            accepted: false,
          },
        ],
      }

      const publicTest = {
        ...privateTest,
        isPublic: true,
      }

      expect(getter(privateTest)).toBe(2)
      expect(getter(publicTest)).toBe(1)
    })
  })
})