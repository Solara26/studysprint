/**
 * Inside a study room — everything live, in one place:
 * shared sprint timer, who's here (presence), room chat, shared notes,
 * and Gia the AI study buddy.
 */

import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useUserLookup } from 'deepspace'
import type { StudyRoom } from '../../../schemas/study-rooms-schema'
import { Badge } from '../../../components/ui'
import PresenceList from '../../../components/studysprint/PresenceList'
import RoomChat from '../../../components/studysprint/RoomChat'
import SharedNotes from '../../../components/studysprint/SharedNotes'
import SprintTimer from '../../../components/studysprint/SprintTimer'
import StudyBuddy from '../../../components/studysprint/StudyBuddy'

function Card({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`flex flex-col rounded-2xl border bg-card p-4 shadow-sm ${className}`}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function RoomPage() {
  const [params] = useSearchParams()
  const roomId = params.get('id') ?? ''
  const { records: rooms, status } = useQuery<StudyRoom>('study-rooms')
  const { getName } = useUserLookup()
  const room = rooms.find((r) => r.recordId === roomId)

  if (!roomId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Which room?</h1>
        <p className="mt-2 text-muted-foreground">
          This link is missing its room. Head back to the lobby and pick one.
        </p>
        <Link to="/rooms" className="mt-4 inline-block font-medium text-primary underline">
          Browse study rooms
        </Link>
      </div>
    )
  }

  if (status === 'ready' && !room) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">That room has closed</h1>
        <p className="mt-2 text-muted-foreground">
          The host may have wrapped it up. No worries — there are plenty more
          rooms, or you can open your own in ten seconds.
        </p>
        <Link to="/rooms" className="mt-4 inline-block font-medium text-primary underline">
          Browse study rooms
        </Link>
      </div>
    )
  }

  if (!room) {
    return <p className="px-6 py-16 text-center text-muted-foreground">Opening your room…</p>
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <Link to="/rooms" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        ← All study rooms
      </Link>
      <header className="mt-2 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{room.data.name}</h1>
        <Badge>{room.data.subject}</Badge>
        <span className="text-sm text-muted-foreground">
          {room.data.topic} · hosted by {getName(room.createdBy) ?? 'a student'}
        </span>
      </header>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <Card title="⏱ Focus sprint">
            <SprintTimer room={room} />
          </Card>
          <Card title="👥 In this room">
            <PresenceList roomId={roomId} />
          </Card>
        </div>

        <Card title="💬 Room chat" className="min-h-[480px]">
          <RoomChat roomId={roomId} />
        </Card>

        <div className="flex flex-col gap-4">
          <Card title="📝 Shared notes" className="min-h-[260px]">
            <SharedNotes roomId={roomId} />
          </Card>
          <Card title="🤖 Gia — AI study buddy" className="min-h-[380px]">
            <StudyBuddy subject={room.data.subject} />
          </Card>
        </div>
      </div>
    </div>
  )
}
