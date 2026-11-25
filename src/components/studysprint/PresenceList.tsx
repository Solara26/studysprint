/**
 * Who's studying in this room right now — live presence via the SDK's
 * PresenceRoom (`usePresenceRoom`). Peers exclude the current user, so the
 * signed-in student is rendered first from their own profile.
 */

import { getUserColor, usePresenceRoom, useUser } from 'deepspace'
import { Avatar, AvatarFallback } from '../ui'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PresenceList({ roomId }: { roomId: string }) {
  const { peers, connected } = usePresenceRoom(`study-room:${roomId}`)
  const { user } = useUser()

  const selfName = user?.name ?? user?.email ?? 'You'

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-block size-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <h3 className="text-sm font-semibold">
          Studying now · {peers.length + 1}
        </h3>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ backgroundColor: getUserColor(user?.id ?? 'me') }}
            >
              {initials(selfName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{selfName} (you)</span>
        </li>
        {peers.map((peer) => (
          <li key={peer.userId} className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ backgroundColor: getUserColor(peer.userId) }}
              >
                {initials(peer.userName || 'Student')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{peer.userName || 'Student'}</span>
            {peer.state.typing ? (
              <span className="text-xs text-muted-foreground">typing…</span>
            ) : null}
          </li>
        ))}
      </ul>
      {peers.length === 0 && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          You're the first one here — nice and early! Share the room link with a
          classmate and they'll pop up here the moment they join.
        </p>
      )}
    </div>
  )
}
