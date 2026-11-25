/**
 * StudySprint home — a warm welcome and a live peek at open rooms.
 */

import { Link } from 'react-router-dom'
import { useAuthProfileReady, useQuery } from 'deepspace'
import type { StudyRoom } from '../../schemas/study-rooms-schema'
import { Badge } from '../../components/ui'

export default function HomePage() {
  const { isSignedIn, user } = useAuthProfileReady({ requireUser: true })
  const { records: rooms, status } = useQuery<StudyRoom>('study-rooms', {
    orderBy: 'createdAt',
  })
  const latest = [...rooms].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)
  const firstName = user?.name?.split(/\s+/)[0]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-violet-100 p-8 dark:from-amber-950 dark:via-background dark:to-violet-950 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {isSignedIn && firstName ? `Welcome back, ${firstName}! 👋` : 'Welcome to StudySprint 👋'}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          StudySprint is where students revise together: live rooms for your exam
          subject, shared notes, a 25-minute focus sprint timer, and Gia, your AI
          study buddy. Built for <strong>New York Regents</strong> and{' '}
          <strong>CSEC / CAPE</strong> students — because the night before the exam
          is not the time to study alone.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/rooms"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Find a study room
          </Link>
          <Link
            to="/assistant"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            Ask Gia a question
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Fresh rooms</h2>
          <Link to="/rooms" className="text-sm font-medium text-primary underline">
            See all rooms
          </Link>
        </div>
        {status === 'loading' && <p className="text-sm text-muted-foreground">Loading rooms…</p>}
        {status === 'ready' && latest.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No rooms yet today. Be the first to open one — your classmates will thank you.
          </p>
        )}
        <ul className="grid gap-4 sm:grid-cols-3">
          {latest.map((room) => (
            <li key={room.recordId} className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold leading-snug">{room.data.name}</h3>
              <div className="mt-2">
                <Badge variant="secondary">{room.data.subject}</Badge>
              </div>
              {room.data.topic && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{room.data.topic}</p>
              )}
              <Link
                to={`/room?id=${room.recordId}`}
                className="mt-3 inline-block text-sm font-medium text-primary underline"
              >
                Join room →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: '⏱ Sprint together',
            body: 'Start a 25-minute focus sprint and the whole room counts down with you. Small steps, big grades.',
          },
          {
            title: '📝 Notes that build themselves',
            body: 'One shared notebook per room — formulas, definitions and past-paper tricks, written by everyone, live.',
          },
          {
            title: '🤖 Meet Gia',
            body: 'Stuck at 11pm? Gia explains topics step by step, quizzes you, and helps plan your revision.',
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
