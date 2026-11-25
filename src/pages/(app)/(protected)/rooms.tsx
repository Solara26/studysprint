/**
 * Study rooms lobby — browse open rooms (live, via useQuery on the
 * study-rooms collection), create a new room, or start from an example.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useMutations, useQuery, useUserLookup } from 'deepspace'
import type { StudyRoom } from '../../../schemas/study-rooms-schema'
import { EXAMPLE_ROOMS, SUBJECT_GROUPS } from '../../../lib/subjects'
import { Badge, Button, Input, Label } from '../../../components/ui'

export default function RoomsPage() {
  const { records: rooms, status } = useQuery<StudyRoom>('study-rooms', {
    orderBy: 'createdAt',
  })
  const { createConfirmed, remove, ready } = useMutations<StudyRoom>('study-rooms')
  const { userId } = useAuth()
  const { getName } = useUserLookup()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [subject, setSubject] = useState(SUBJECT_GROUPS[0].subjects[0])
  const [topic, setTopic] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createRoom(values: { name: string; subject: string; topic: string }) {
    setCreating(true)
    setError(null)
    try {
      const id = await createConfirmed({
        name: values.name.trim(),
        subject: values.subject,
        topic: values.topic.trim(),
        sprintGoal: '',
        sprintStatus: 'idle',
        sprintStartedAt: 0,
        sprintDurationSec: 1500,
      })
      navigate(`/room?id=${id}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the room — try again.')
      setCreating(false)
    }
  }

  function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give your room a name first — something your classmates will recognise.')
      return
    }
    void createRoom({ name, subject, topic })
  }

  const sorted = [...rooms].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Study rooms</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a room for your exam and subject, or open a new one. Every room has
          live chat, shared notes, a focus sprint timer, and Gia — your AI study
          buddy. Studying together beats studying alone, every time.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Open a new room</h2>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="room-name">Room name</Label>
              <Input
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Friday Night Algebra Sprint"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room-subject">Exam subject</Label>
              <select
                id="room-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {SUBJECT_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room-topic">Topic you're tackling</Label>
              <Input
                id="room-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quadratic equations, chapter 4"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={creating || !ready}>
              {creating ? 'Opening your room…' : 'Create room & join'}
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold">Short on ideas? Start an example room</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLE_ROOMS.map((example) => (
                <button
                  key={example.name}
                  type="button"
                  disabled={creating || !ready}
                  onClick={() => void createRoom(example)}
                  className="rounded-full border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {example.subject} · {example.topic.split('—')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Open rooms {status === 'ready' ? `· ${sorted.length}` : ''}
          </h2>
          {status === 'loading' && <p className="text-sm text-muted-foreground">Loading rooms…</p>}
          {status === 'ready' && sorted.length === 0 && (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <p className="font-medium">No rooms yet — yours could be the first! 🌱</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Open a room for your subject and invite your classmates. It takes
                ten seconds.
              </p>
            </div>
          )}
          <ul className="grid gap-4 sm:grid-cols-2">
            {sorted.map((room) => (
              <li
                key={room.recordId}
                className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug">{room.data.name}</h3>
                  {room.data.sprintStatus === 'running' && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      Sprint live
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Badge variant="secondary">{room.data.subject}</Badge>
                </div>
                {room.data.topic && (
                  <p className="mt-2 text-sm text-muted-foreground">{room.data.topic}</p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Hosted by {getName(room.createdBy) ?? 'a student'} · opened{' '}
                  {new Date(room.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Link
                    to={`/room?id=${room.recordId}`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Join room
                  </Link>
                  {room.createdBy === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void remove(room.recordId)}
                    >
                      Close room
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
