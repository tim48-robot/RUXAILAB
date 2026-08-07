import { jest } from '@jest/globals'

const mockUserGet = jest.fn()
const mockTestsGet = jest.fn()
const mockBatchSet = jest.fn()
const mockBatchCommit = jest.fn()

const mockBatch = {
  set: mockBatchSet,
  commit: mockBatchCommit,
}

const mockDb = {
  collection: jest.fn((name) => {
    if (name === 'users') {
      return {
        doc: jest.fn(() => ({
          get: mockUserGet,
        })),
      }
    }

    if (name === 'tests') {
      return {
        get: mockTestsGet,
      }
    }

    if (name === 'answers') {
      return {
        doc: jest.fn((id) => ({ id, path: `answers/${id}` })),
      }
    }

    throw new Error(`Unexpected collection: ${name}`)
  }),
  batch: jest.fn(() => mockBatch),
}

jest.unstable_mockModule('../src/f.firebase.js', () => ({
  admin: {
    firestore: jest.fn(() => mockDb),
  },
  functions: {
    onCall: jest.fn((options) => options.handler),
    https: {
      HttpsError: class HttpsError extends Error {
        constructor(code, message) {
          super(message)
          this.code = code
        }
      },
    },
  },
}))

const { backfillStudyAccessMetadata } =
  await import('../src/https/backfillStudyAccess.js')

const userSnap = ({ exists = true, accessLevel } = {}) => ({
  exists,
  data: () => ({ accessLevel }),
})

const testSnap = (id, data, participants = []) => ({
  id,
  ref: {
    id,
    path: `tests/${id}`,
    collection: jest.fn((name) => {
      if (name !== 'participants') {
        throw new Error(`Unexpected subcollection: ${name}`)
      }

      return {
        get: jest.fn().mockResolvedValue({
          docs: participants.map((participant, index) => ({
            id: `participant-${index + 1}`,
            data: () => participant,
          })),
        }),
      }
    }),
  },
  data: () => data,
})

describe('backfillStudyAccessMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBatchCommit.mockResolvedValue(undefined)
  })

  it('requires authentication', async () => {
    await expect(backfillStudyAccessMetadata({ auth: null })).rejects.toThrow(
      expect.objectContaining({ code: 'unauthenticated' }),
    )

    expect(mockDb.collection).not.toHaveBeenCalled()
  })

  it('requires a platform Super Admin', async () => {
    mockUserGet.mockResolvedValueOnce(userSnap({ accessLevel: 1 }))

    await expect(
      backfillStudyAccessMetadata({ auth: { uid: 'regular-user' } }),
    ).rejects.toThrow(expect.objectContaining({ code: 'permission-denied' }))

    expect(mockTestsGet).not.toHaveBeenCalled()
  })

  it('backfills study role maps and answer ownership metadata', async () => {
    mockUserGet.mockResolvedValueOnce(userSnap({ accessLevel: 0 }))
    mockTestsGet.mockResolvedValueOnce({
      docs: [
        testSnap(
          'study-1',
          {
            answersDocId: 'answer-1',
            testAdmin: { userDocId: 'owner-1' },
            cooperators: [
              { userDocId: 'admin-1', accessLevel: 0, accepted: true },
              { userDocId: 'manager-1', accessLevel: 4, accepted: true },
              { userDocId: 'pending-1', accessLevel: 5, accepted: false },
              { userDocId: 'missing-role', accepted: true },
            ],
          },
          [
            {
              userDocId: 'participant-1',
              accessLevel: 5,
              status: 'accepted',
            },
            {
              userDocId: 'pending-participant',
              accessLevel: 5,
              status: 'pending',
            },
          ],
        ),
        testSnap('study-2', {
          testAdmin: { userDocId: 'owner-2' },
          cooperators: [
            { userDocId: 'observer-1', accessLevel: 3, accepted: true },
          ],
        }),
      ],
    })

    await expect(
      backfillStudyAccessMetadata({ auth: { uid: 'super-admin' } }),
    ).resolves.toEqual({
      studiesUpdated: 2,
      answersUpdated: 1,
    })

    expect(mockBatchSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'study-1', path: 'tests/study-1' }),
      {
        studyRoleMap: {
          'admin-1': 0,
          'manager-1': 4,
          'participant-1': 5,
        },
      },
      { merge: true },
    )
    expect(mockBatchSet).toHaveBeenCalledWith(
      { id: 'answer-1', path: 'answers/answer-1' },
      {
        studyId: 'study-1',
        createdBy: 'owner-1',
      },
      { merge: true },
    )
    expect(mockBatchSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'study-2', path: 'tests/study-2' }),
      {
        studyRoleMap: {
          'observer-1': 3,
        },
      },
      { merge: true },
    )
    expect(mockBatchCommit).toHaveBeenCalledTimes(1)
  })
})
