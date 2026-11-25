/**
 * Gia, the AI study buddy — the platform's own AI chat (`ChatPanel` from the
 * ai-chat feature) embedded in the room. Chats are per-student (the panel
 * auto-creates one on first send), stream through the app's AI routes, and
 * are billed by the platform to the signed-in student's DeepSpace credits.
 */

import { useState } from 'react'
import { listDeepSpaceAgentModels, useAuth } from 'deepspace'
import { ChatPanel } from '../ChatPanel'

/**
 * Gia's model list, free-plan-friendly first. The platform default
 * (Claude Opus) answers "Payment Required" for students on DeepSpace's
 * free plan, while Claude Haiku works — so Haiku leads the list and is
 * every fresh chat's default. Students can still pick a bigger model
 * in the picker.
 */
export const GIA_MODELS = listDeepSpaceAgentModels('application')
  .map((model) => ({
    id: model.id,
    label: model.label,
    provider: model.providerLabel,
  }))
  .sort((a, b) =>
    a.id === 'claude-haiku-5-5' ? -1 : b.id === 'claude-haiku-5-5' ? 1 : 0,
  )

export default function StudyBuddy({ subject }: { subject: string }) {
  const { userId } = useAuth()
  const [chatId, setChatId] = useState<string | null>(null)

  if (!userId) {
    return <p className="text-sm text-muted-foreground">Sign in to ask Gia a question.</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 [&>*]:h-full">
        <ChatPanel
          chatId={chatId}
          userId={userId}
          onChatCreated={setChatId}
          models={GIA_MODELS}
          compact
          emptyStatePrompts={[
            `Explain a ${subject} topic I'm stuck on, step by step`,
            'Quiz me with 5 practice questions and check my answers',
            'Make me a 3-day revision plan before my exam',
            'What are the most common mistakes students make in this subject?',
          ]}
        />
      </div>
      <p className="pt-2 text-xs text-muted-foreground">
        Gia is your AI study buddy for {subject}. Always double-check important
        answers against your textbook or teacher.
      </p>
    </div>
  )
}
