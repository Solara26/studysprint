/**
 * Focus sprint timer — shared by the whole room. The sprint state lives on
 * the study-room record (goal, status, start timestamp, duration), so when
 * one student starts a sprint, every member's countdown starts together.
 * Each client derives the remaining time from the shared start timestamp;
 * no timer state is kept locally.
 */

import { useEffect, useState } from 'react'
import { useMutations, type RecordData } from 'deepspace'
import type { StudyRoom } from '../../schemas/study-rooms-schema'
import { Button, Input } from '../ui'

const SPRINT_MINUTES = 25

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export default function SprintTimer({ room }: { room: RecordData<StudyRoom> }) {
  const { put, ready } = useMutations<StudyRoom>('study-rooms')
  const [goalDraft, setGoalDraft] = useState('')
  const [now, setNow] = useState(() => Date.now())

  const { sprintGoal, sprintStatus, sprintStartedAt, sprintDurationSec } = room.data
  const running = sprintStatus === 'running' && sprintStartedAt > 0
  const duration = sprintDurationSec || SPRINT_MINUTES * 60
  const elapsed = running ? (now - sprintStartedAt) / 1000 : 0
  const remaining = duration - elapsed
  const finished = running && remaining <= 0
  const progress = running ? Math.min(1, Math.max(0, elapsed / duration)) : 0

  useEffect(() => {
    if (!running || finished) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [running, finished])

  async function startSprint() {
    const goal = (goalDraft || sprintGoal || '').trim()
    await put(room.recordId, {
      sprintGoal: goal,
      sprintStatus: 'running',
      sprintStartedAt: Date.now(),
      sprintDurationSec: SPRINT_MINUTES * 60,
    })
    setGoalDraft('')
  }

  async function resetSprint() {
    await put(room.recordId, {
      sprintStatus: 'idle',
      sprintStartedAt: 0,
    })
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-4xl font-bold tabular-nums tracking-tight">
            {running ? formatClock(remaining) : formatClock(duration)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {finished
              ? 'Sprint complete — great work, everyone! 🎉 Take a breather.'
              : running
                ? 'Sprint in progress — heads down, phones away.'
                : `${SPRINT_MINUTES}-minute focus sprint, shared by the whole room.`}
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {finished ? 'Done' : running ? 'Live' : 'Ready'}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-amber-500 transition-[width] duration-500"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {sprintGoal ? (
        <p className="mt-3 text-sm">
          <span className="font-semibold">Sprint goal:</span> {sprintGoal}
        </p>
      ) : null}

      {!running ? (
        <div className="mt-3 flex gap-2">
          <Input
            value={goalDraft}
            onChange={(e) => setGoalDraft(e.target.value)}
            placeholder="Sprint goal — e.g. Finish 10 past-paper questions"
            aria-label="Sprint goal"
          />
          <Button onClick={() => void startSprint()} disabled={!ready}>
            Start sprint
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <Button variant="outline" onClick={() => void resetSprint()} disabled={!ready}>
            {finished ? 'Start fresh' : 'Reset sprint'}
          </Button>
        </div>
      )}
    </div>
  )
}
