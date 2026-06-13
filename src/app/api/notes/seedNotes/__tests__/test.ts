import { SEED_NOTES } from '../constants'

import { createSeedNotes } from '..'

describe('[api] createSeedNotes', () => {
  it('should create one note per seed definition', () => {
    const store = createSeedNotes()

    expect(store.size).toBe(SEED_NOTES.length)
    expect(Array.from(store.values()).map(note => note.title)).toEqual(
      SEED_NOTES.map(seed => seed.title)
    )
  })

  it('should key each note by its generated unique id', () => {
    const store = createSeedNotes()
    const otherStore = createSeedNotes()

    for (const [key, note] of store) {
      expect(key).toBe(note.id)
    }

    const allIds = new Set([...store.keys(), ...otherStore.keys()])
    expect(allIds.size).toBe(SEED_NOTES.length * 2)
  })

  it('should set ISO timestamps for createdAt and updatedAt', () => {
    const store = createSeedNotes()

    for (const note of store.values()) {
      expect(new Date(note.createdAt).toISOString()).toBe(note.createdAt)
      expect(new Date(note.updatedAt).toISOString()).toBe(note.updatedAt)
    }
  })
})
