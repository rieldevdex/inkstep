/**
 * All copy for inkstep.site, taken from the club proposal.
 * Edit text here; components only present it.
 */
export const site = {
  name: 'Inkstep',
  url: 'https://inkstep.site/',
  nameVi: 'Câu lạc bộ Phát triển Sản phẩm Học tập',
  slogan: { vi: 'Từng nét mực, từng bước tiến.', en: 'Every stroke of ink, every step forward.' },
  /** Set to the real form URL to turn the "opening soon" note into a button. */
  applyUrl: null,

  nav: [
    { href: '#work', label: 'Work' },
    { href: '#teams', label: 'Teams' },
    { href: '#process', label: 'Process' },
    { href: '#events', label: 'Events' },
  ],

  hero: {
    eyebrow: 'Student club · School year 2026–2027',
    lines: ['We build', 'free learning', 'tools'],
    lede: 'Inkstep is a student club that designs, writes, codes and launches study tools that students actually use. Members learn real skills by shipping a real product.',
    meta: [
      { k: 'Who', v: 'Grades 9–12' },
      { k: 'Time', v: 'About 3 hours a week' },
      { k: 'Next', v: 'Public beta of Eighthundred' },
    ],
  },

  ticker: ['Free forever', 'No ads', 'Original questions', 'Built by students', 'Two-week cycles', 'Every contribution credited'],

  featured: {
    label: 'Current project',
    name: 'Eighthundred',
    status: 'Alpha · live',
    url: 'https://eighthundred.site',
    host: 'eighthundred.site',
    screenshot: {
      src: 'assets/eighthundred-1000.webp',
      src2x: 'assets/eighthundred-2000.webp',
      width: 1000,
      height: 632,
      alt: 'Eighthundred home page: the headline “SAT Math you actually understand.” beside an interactive lab where you drag a parabola’s vertex.',
    },
    summary: 'A free SAT Math platform named after the perfect score. It teaches step by step, then works out why you got a question wrong and plans practice around it.',
    plan: 'This year the club grows its original question bank, finishes the AI tutor with safety rules for under-18 users, tests it with students at school, and prepares a public beta.',
    stats: [
      { n: '24', label: 'lessons', note: 'across 8 units, with interactive labs' },
      { n: '266', label: 'questions', note: '96 written in-house, answers checked independently' },
      { n: '72', label: 'generators', note: 'creating new questions without limit' },
      { n: '35', label: 'minutes', note: 'Real Practice: 22 questions, module 2 adapts' },
    ],
  },

  teamFilters: [
    { id: 'all', label: 'All teams' },
    { id: 'make', label: 'Make the product' },
    { id: 'grow', label: 'Grow the club' },
  ],

  teams: [
    { id: 'content', group: 'make', name: 'Content', vi: 'Ban Chuyên môn',
      summary: 'Writes lessons and original questions, solves each one independently to check the answer, and approves content before release.',
      trial: 'Write one original SAT Math question with a solution, and find the mistake in a flawed one.',
      skills: ['Math', 'Writing', 'Review'] },
    { id: 'developer', group: 'make', name: 'Developers', vi: 'Ban Developer',
      summary: 'Builds features, fixes bugs, looks after accounts and the database, and tests every release.',
      trial: 'Fix a small, real bug on Eighthundred.',
      skills: ['Web', 'Databases', 'Testing'] },
    { id: 'design', group: 'make', name: 'Design', vi: 'Ban Thiết kế',
      summary: 'Designs screens, icons, images and video, and keeps the product and the club looking like one brand.',
      trial: 'Redesign one screen or one social media post.',
      skills: ['Interface', 'Branding', 'Video'] },
    { id: 'marketing', group: 'grow', name: 'Marketing', vi: 'Ban Marketing',
      summary: 'Brings the product to students on TikTok, Facebook and Instagram, runs launches, and measures what works.',
      trial: 'Plan one week of posts for a feature launch.',
      skills: ['Social', 'Campaigns', 'Analytics'] },
    { id: 'pr', group: 'grow', name: 'PR & Partnerships', vi: 'Ban PR – Đối ngoại',
      summary: 'Builds trust with the school, teachers, other clubs and sponsors, and handles the club’s emails.',
      trial: 'Write an email inviting another club to work with us.',
      skills: ['Outreach', 'Email', 'Partners'] },
    { id: 'people', group: 'grow', name: 'People & Logistics', vi: 'Ban Nhân sự – Hậu cần',
      summary: 'Recruits and trains members, tracks contributions, and prepares rooms and supplies for events.',
      trial: 'Plan a 60-minute workshop.',
      skills: ['Recruiting', 'Training', 'Events'] },
  ],

  process: {
    title: 'Every two weeks, one step up',
    note: 'Steps 4 and 5 are two safety nets: content that isn’t right goes back to Content, bugs go back to Developers, before anything is released.',
    steps: [
      { name: 'Pick a goal', text: 'Agree on one thing to ship.' },
      { name: 'Design', text: 'Screens, flows and visuals.' },
      { name: 'Build', text: 'Write the content and the code.' },
      { name: 'Content check', text: 'Two members solve every question on their own.', check: true },
      { name: 'Tech check', text: 'Test before anything goes live.', check: true },
      { name: 'Ship', text: 'Release it to real students.' },
      { name: 'Listen', text: 'Collect feedback for the next cycle.' },
    ],
  },

  events: [
    { name: 'Question Jam', kind: 'Competition', when: 'Semester 1', open: true,
      text: 'Write an original SAT Math question on a set theme. Judged on accuracy, originality and the quality of the solution.',
      prize: 'The best questions go live on Eighthundred with the author’s name.' },
    { name: 'SAT Math Week', kind: 'Practice week', when: 'Before each SAT date', open: false,
      text: 'A daily challenge, one Real Practice mock test, and a class leaderboard on Eighthundred.',
      prize: 'Prizes for the most improved student and class.' },
    { name: 'Ink & Code Day', kind: 'Showcase', when: 'End of each semester', open: false,
      text: 'Each team shows what it built. Students and teachers try it and give feedback on the spot.',
      prize: 'No prizes. Every team gets written feedback.' },
    { name: 'Hackathon 800', kind: 'Competition', when: 'Semester 2', open: true,
      text: 'Teams of 3–5 get one day to build a small study tool for any subject.',
      prize: 'The best idea may become the club’s next project.' },
  ],

  join: {
    title: 'No experience needed.',
    who: 'We recruit Vinschool Smart City students from grades 9 to 12 who want to work on a real product, learn new skills, and own their mistakes when they find them.',
    path: [
      { name: 'Apply', text: 'Fill in a short form and pick a team.' },
      { name: 'Try a small task', text: 'Each team has its own trial task.' },
      { name: 'Chat for 10 minutes', text: 'Meet the team lead.' },
      { name: 'Two-week trial', text: 'Work through one real cycle with us.' },
    ],
    soon: 'Applications open soon',
  },
};
