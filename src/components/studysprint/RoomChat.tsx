/**
 * Per-room chat. Each study room owns one public messaging channel, found or
 * created deterministically by name (`study-<roomId>`) — the SDK's own
 * convergence pattern from `useChatChannel`, so every member lands in the
 * same channel. Messages stream in real time through the RecordRoom.
 */

import { useEffect, useRef, useState } from 'react'
import { useMessages, usePresenceRoom, useUserLookup } from 'deepspace'
import { useChatChannel } from '../messaging/hooks/useChatChannel'
import { Button, Input } from '../ui'

export default function RoomChat({ roomId }: { roomId: string }) {
  const { channelId, status: channelStatus } = useChatChannel(`study-${roomId}`)
  const { messages, status, send } = useMessages(channelId)
  const { getName } = useUserLookup()
  const { peers, updateState } = usePresenceRoom(`study-room:${roomId}`)
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const sorted = [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const typers = peers.filter((p) => p.state.typing).map((p) => p.userName)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [sorted.length])

  function handleChange(value: string) {
    setDraft(value)
    updateState({ typing: true })
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => updateState({ typing: false }), 1500)
  }

  function handleSend(event: React.FormEvent) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || !channelId) return
    void send(content)
    setDraft('')
    updateState({ typing: false })
  }

  if (channelStatus !== 'ready' || !channelId || status === 'loading') {
    return <p className="text-sm text-muted-foreground">Opening the room chat…</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {sorted.length === 0 && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            No messages yet. Say hello, share what you're working on, or drop a
            question for the room — somebody here is revising the same topic.
          </p>
        )}
        {sorted.map((message) => (
          <div key={message.recordId} className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">
                {getName(message.data.authorId) ?? 'Student'}
              </span>
              <time className="text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </time>
            </div>
            <p className="text-sm leading-relaxed">
              {message.data.deleted ? (
                <span className="italic text-muted-foreground">[message deleted]</span>
              ) : (
                message.data.content
              )}
            </p>
          </div>
        ))}
      </div>
      {typers.length > 0 && (
        <p className="pt-2 text-xs text-muted-foreground">{typers.join(', ')} typing…</p>
      )}
      <form onSubmit={handleSend} className="flex gap-2 pt-3">
        <Input
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Message the room…"
          aria-label="Message the room"
        />
        <Button type="submit" disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  )
}
