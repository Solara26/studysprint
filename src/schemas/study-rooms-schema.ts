/**
 * StudySprint — study rooms collection.
 *
 * One record per study room. The room list, room details, and the shared
 * focus-sprint state all live on this record and sync in real time through
 * the RecordRoom. Per-room chat uses the bundled messaging collections
 * (one channel per room); shared notes use a YjsRoom keyed by the room id;
 * presence uses a PresenceRoom scoped per room — see the room page.
 */

import type { CollectionSchema } from 'deepspace/schema'

export interface StudyRoom {
  name: string
  subject: string
  topic: string
  /** Shared sprint state — written by any member, read by everyone. */
  sprintGoal: string
  sprintStatus: 'idle' | 'running'
  /** Epoch ms when the current sprint started (0 when idle). */
  sprintStartedAt: number
  /** Sprint length in seconds (1500 = 25 minutes). */
  sprintDurationSec: number
}

export const studyRoomsSchema: CollectionSchema = {
  name: 'study-rooms',
  columns: [
    { name: 'name', storage: 'text', interpretation: 'plain', required: true },
    { name: 'subject', storage: 'text', interpretation: 'plain', required: true },
    { name: 'topic', storage: 'text', interpretation: 'plain' },
    { name: 'sprintGoal', storage: 'text', interpretation: 'plain' },
    { name: 'sprintStatus', storage: 'text', interpretation: 'plain' },
    { name: 'sprintStartedAt', storage: 'number', interpretation: 'plain' },
    { name: 'sprintDurationSec', storage: 'number', interpretation: 'plain' },
  ],
  permissions: {
    // Signed-out visitors can't reach the room pages (AuthGate), but keep
    // the data layer honest too: viewers may look, only members may write.
    viewer: { read: true, create: false, update: false, delete: false },
    member: { read: true, create: true, update: true, delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
