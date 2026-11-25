/**
 * StudySprint landing page — a STATIC page (no providers, prerendered).
 * The live app (sign-in, rooms, chat) sits behind the links below.
 */

import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

const REGENTS = [
  'Algebra I',
  'Geometry',
  'Algebra II',
  'ELA',
  'Global History',
  'U.S. History',
  'Living Environment',
  'Earth Science',
  'Chemistry',
  'Physics',
  'Spanish',
]

const CSEC_CAPE = [
  'CSEC Mathematics',
  'CSEC English A',
  'CSEC Integrated Science',
  'CSEC Biology',
  'CSEC Chemistry',
  'CSEC Physics',
  'CSEC Social Studies',
  'CAPE Biology',
  'CAPE Pure Mathematics',
  'CAPE Communication Studies',
]

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <div data-testid="static-landing" className="min-h-screen bg-[#fffbf3] text-[#1c1917]">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-bold tracking-tight">
            📚 StudySprint
          </span>
          <Link
            to="/rooms"
            className="inline-flex items-center rounded-full bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Enter the app
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6">
          <section className="py-14 text-center sm:py-20">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b45309]">
              Regents · CSEC · CAPE
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Don't study alone. <span className="text-[#7c3aed]">Sprint together.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[#57534e]">
              StudySprint puts you in a live room with students revising the same
              exam: real-time chat, shared notes you build together, a 25-minute
              focus sprint timer, and Gia — an AI study buddy who never sleeps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/rooms"
                className="inline-flex items-center rounded-full bg-[#7c3aed] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Find your study room
              </Link>
              <Link
                to="/home"
                className="inline-flex items-center rounded-full border border-[#d6d3d1] bg-white px-6 py-3 text-sm font-medium transition-colors hover:bg-[#f5f5f4]"
              >
                See how it works
              </Link>
            </div>
          </section>

          <section className="grid gap-4 pb-14 sm:grid-cols-3">
            {[
              {
                title: '⏱ 25-minute sprints',
                body: 'One timer for the whole room. Set a goal, start the sprint, and feel the whole group focus with you.',
              },
              {
                title: '📝 One notebook, every brain',
                body: 'Shared notes sync live as you type — the formulas and tricks your room collects stay for everyone.',
              },
              {
                title: '🤖 Gia, AI study buddy',
                body: 'Step-by-step explanations, practice quizzes and revision plans, in every room, any hour.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#e7e5e4] bg-white p-6 shadow-sm">
                <h2 className="font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#57534e]">{f.body}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 pb-16 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6 shadow-sm">
              <h2 className="font-semibold">New York Regents</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {REGENTS.map((s) => (
                  <span key={s} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-900">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6 shadow-sm">
              <h2 className="font-semibold">CSEC / CAPE (Caribbean)</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {CSEC_CAPE.map((s) => (
                  <span key={s} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <footer className="border-t border-[#e7e5e4] py-8 text-center text-sm text-[#57534e]">
            Made with care for students everywhere. You've got this — one sprint at a time. 💛
          </footer>
        </main>
      </div>
    </>
  )
}
