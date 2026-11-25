/**
 * Exam subjects for the room-creation picker, grouped so students can find
 * their exam fast. StudySprint serves both of Karlene's teaching worlds:
 * New York Regents exams and Caribbean CSEC/CAPE.
 *
 * Regents values carry a "Regents" prefix so a room card is never ambiguous
 * (e.g. "Regents Chemistry" vs "CSEC Chemistry").
 */

export interface SubjectGroup {
  label: string
  subjects: string[]
}

export const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    label: 'New York Regents Exams',
    subjects: [
      'Regents Algebra I',
      'Regents Geometry',
      'Regents Algebra II',
      'Regents English Language Arts (ELA)',
      'Regents Global History & Geography',
      'Regents U.S. History & Government',
      'Regents Living Environment',
      'Regents Earth Science',
      'Regents Chemistry',
      'Regents Physics',
      'Regents Spanish',
    ],
  },
  {
    label: 'CSEC / CAPE (Caribbean)',
    subjects: [
      'CSEC Mathematics',
      'CSEC English A',
      'CSEC English B',
      'CSEC Integrated Science',
      'CSEC Biology',
      'CSEC Chemistry',
      'CSEC Physics',
      'CSEC Social Studies',
      'CSEC Principles of Business',
      'CSEC Information Technology',
      'CSEC Spanish',
      'CSEC Caribbean History',
      'CAPE Biology',
      'CAPE Chemistry',
      'CAPE Pure Mathematics',
      'CAPE Communication Studies',
      'CAPE Caribbean Studies',
    ],
  },
  {
    label: 'Everything else',
    subjects: ['Other / General Study'],
  },
]

/** One-click example rooms for an empty lobby — spans both exam groups. */
export const EXAMPLE_ROOMS: Array<{ name: string; subject: string; topic: string }> = [
  {
    name: 'Algebra I Sprint Squad',
    subject: 'Regents Algebra I',
    topic: 'Quadratic equations & factoring',
  },
  {
    name: 'Living Environment Review Crew',
    subject: 'Regents Living Environment',
    topic: 'Cell biology and homeostasis',
  },
  {
    name: 'Global History Night Owls',
    subject: 'Regents Global History & Geography',
    topic: 'Enduring issues essay practice',
  },
  {
    name: 'CSEC Maths Sprinters',
    subject: 'CSEC Mathematics',
    topic: 'Algebra, functions and graphs',
  },
  {
    name: 'CSEC English A Essay Room',
    subject: 'CSEC English A',
    topic: 'Argumentative essay writing',
  },
  {
    name: 'CAPE Biology Study Circle',
    subject: 'CAPE Biology',
    topic: 'Unit 1 — biomolecules and cells',
  },
]
