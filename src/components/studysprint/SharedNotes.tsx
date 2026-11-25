/**
 * Shared room notes — a collaborative Yjs text document, one per room
 * (`useYjsRoom`). Every keystroke syncs to the other students in the room
 * through the YjsRoom Durable Object; the document persists server-side.
 * This is the same pattern DeepSpace's own documents feature uses.
 */

import { useYjsRoom } from 'deepspace'
import { Textarea } from '../ui'

export default function SharedNotes({ roomId }: { roomId: string }) {
  const { text, setText, synced, canWrite } = useYjsRoom(roomId, 'notes')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!synced || !canWrite}
        placeholder={
          synced
            ? 'Jot down formulas, definitions, tricky questions… Everyone in the room sees this live.'
            : 'Connecting to the shared notes…'
        }
        className="min-h-40 flex-1 resize-none text-sm leading-relaxed"
        aria-label="Shared room notes"
      />
      <p className="pt-2 text-xs text-muted-foreground">
        {synced
          ? 'Notes sync live for everyone in this room — build them together.'
          : 'Syncing…'}
      </p>
    </div>
  )
}
