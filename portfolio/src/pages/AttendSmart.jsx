import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImg from '../assets/AttendSmart-Hero-Projects.webp';
import DesignImg from '../assets/AttendSmart(Design).webp';
import UnderstandImg from '../assets/AttendSmart(Understand).webp';
import FirstImg from '../assets/AttendSmart(1st).webp';
import '../styles/CaseStudy.css';
import {
  fadeUp,
  fadeIn,
  slideLeft,
  slideRight,
  staggerContainer,
  staggerItem,
  pageTransition,
  viewport,
} from '../animations';

const PHASES = [
  { id: 'understand', number: '01', label: 'Understand' },
  { id: 'research',   number: '02', label: 'Research'   },
  { id: 'define',     number: '03', label: 'Define'     },
  { id: 'strategy',   number: '04', label: 'Strategy'   },
  { id: 'design',     number: '05', label: 'Design'     },
  { id: 'validation', number: '06', label: 'Validation' },
];

/* ─── Stacked rows ─── */
function StackedRows({ rows, connector = '↓' }) {
  return (
    <motion.div
      className="cs-stacked-rows"
      variants={staggerContainer(0.12)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {rows.map((row, i) => (
        <motion.div key={i} variants={staggerItem}>
          <div className="cs-row-card">
            <div className="cs-row-left">
              <span className="cs-row-title">{row.title}</span>
              {row.sub && <span className="cs-row-sub">{row.sub}</span>}
            </div>
            {row.badge && (
              <span className={`cs-row-badge cs-row-badge--${row.variant || 'default'}`}>
                {row.badge}
              </span>
            )}
          </div>
          {i < rows.length - 1 && (
            <div className="cs-row-connector">{connector}</div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── 2×2 stat grid ─── */
function StatGrid({ stats }) {
  return (
    <motion.div
      className="cs-stats-grid"
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {stats.map(({ number, label }) => (
        <motion.div key={label} className="cs-stat" variants={staggerItem}>
          <span className="cs-stat-number">{number}</span>
          <span className="cs-stat-label">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Phase block ─── */
function PhaseBlock({ subLabel, title, body, extra, visual, statsVariant, flip }) {
  const textVariant  = flip ? slideRight : slideLeft;
  const visualVariant = flip ? slideLeft  : slideRight;

  return (
    <div className={`cs-phase-block${statsVariant ? ' cs-phase-block--stats' : ''}`}>
      <motion.div
        className="cs-phase-text"
        variants={textVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {subLabel && <span className="cs-sub-label">{subLabel}</span>}
        <h2 className="cs-block-title">{title}</h2>
        {typeof body === 'string'
          ? <p className="cs-block-body">{body}</p>
          : body}
        {extra}
      </motion.div>
      <motion.div
        className="cs-phase-visual"
        variants={visualVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {visual}
      </motion.div>
    </div>
  );
}

/* ─── Bar chart for time-motion study ─── */
function BarChart() {
  const bars = [
    { label: 'Small\n(≤20)',   manual: 34,  nfc: 6,  manualLabel: '1:10', nfcLabel: '0:12' },
    { label: 'Medium\n(21–35)', manual: 62, nfc: 9,  manualLabel: '2:05', nfcLabel: '0:17' },
    { label: 'Large\n(36+)',   manual: 100, nfc: 12, manualLabel: '3:20', nfcLabel: '0:22' },
  ];

  return (
    <motion.div
      className="as-chart-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <span className="cs-sub-label">Time-motion study</span>
      <p className="as-chart-title">Average roll call time by class size</p>
      <div className="as-bars">
        {bars.map(({ label, manual, nfc, manualLabel, nfcLabel }) => (
          <div key={label} className="as-bar-group">
            <div className="as-bar-pair">
              <div className="as-bar-wrap">
                <span className="as-bar-val">{manualLabel}</span>
                <motion.div
                  className="as-bar as-bar--manual"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${manual}%` }}
                  viewport={viewport}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
              <div className="as-bar-wrap">
                <span className="as-bar-val">{nfcLabel}</span>
                <motion.div
                  className="as-bar as-bar--nfc"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${nfc}%` }}
                  viewport={viewport}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                />
              </div>
            </div>
            <span className="as-bar-label">
              {label.split('\n').map((l, i) => <span key={i}>{l}</span>)}
            </span>
          </div>
        ))}
      </div>
      <div className="as-legend">
        <div className="as-legend-item">
          <span className="as-legend-dot as-legend-dot--manual" />
          Manual roll call
        </div>
        <div className="as-legend-item">
          <span className="as-legend-dot as-legend-dot--nfc" />
          NFC tap-in (observed)
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Donut chart for reliability ─── */
function DonutChart() {
  const RADIUS = 55;
  const CIRC   = 2 * Math.PI * RADIUS; // ≈ 345.6
  const successPct = 0.935;
  const successDash = successPct * CIRC;
  const failDash    = (1 - successPct) * CIRC;

  return (
    <motion.div
      className="as-viz-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <span className="cs-sub-label">Reliability</span>
      <p className="as-chart-title">Tap outcomes across 240 test taps</p>
      <div className="as-donut-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Track */}
          <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#1d1d1a" strokeWidth="18" />
          {/* Success arc — animated */}
          <motion.circle
            cx="70" cy="70" r={RADIUS}
            fill="none" stroke="#D4AF37" strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${successDash} ${CIRC}`}
            strokeDashoffset="0"
            transform="rotate(-90 70 70)"
            initial={{ strokeDasharray: `0 ${CIRC}` }}
            whileInView={{ strokeDasharray: `${successDash} ${CIRC}` }}
            viewport={viewport}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          />
          {/* Fail arc */}
          <motion.circle
            cx="70" cy="70" r={RADIUS}
            fill="none" stroke="#2a2a2a" strokeWidth="18"
            strokeDasharray={`${failDash} ${CIRC}`}
            strokeDashoffset={-successDash}
            transform="rotate(-90 70 70)"
            initial={{ strokeDasharray: `0 ${CIRC}` }}
            whileInView={{ strokeDasharray: `${failDash} ${CIRC}` }}
            viewport={viewport}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          />
          <text x="70" y="66" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700" fontFamily="DM Sans, Inter">93.5%</text>
          <text x="70" y="82" textAnchor="middle" fill="#555555" fontSize="9.5" fontFamily="DM Sans, Inter">first-tap success</text>
        </svg>
        <div className="as-donut-legend">
          <div className="as-donut-li">
            <span className="as-donut-dot as-donut-dot--success" />
            <span>Read on first tap — <strong>224</strong></span>
          </div>
          <div className="as-donut-li">
            <span className="as-donut-dot as-donut-dot--fail" />
            <span>Needed a second tap — <strong>16</strong></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Speed / criteria card ─── */
function SpeedCard() {
  const criteria = [
    { label: 'Avg. time saved / class', pct: 88 },
    { label: 'Faculty satisfaction',    pct: 91 },
    { label: 'Record accuracy',         pct: 96 },
  ];

  return (
    <motion.div
      className="as-viz-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ delay: 0.1 }}
    >
      <span className="cs-sub-label">Speed</span>
      <p className="as-chart-title">Time saved per class, manual vs. NFC</p>

      {/* Sparkline SVG */}
      <svg width="100%" height="90" viewBox="0 0 460 90" preserveAspectRatio="none" style={{ display: 'block' }}>
        <polyline points="0,14 76,20 153,32 230,46 306,60 383,72 460,78" fill="none" stroke="#2a2a2a" strokeWidth="2.5" />
        <polyline points="0,76 76,78 153,79 230,80 306,80 383,81 460,81" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        <circle cx="460" cy="78" r="4" fill="#2a2a2a" />
        <circle cx="460" cy="81" r="4" fill="#D4AF37" />
      </svg>
      <div className="as-spark-labels">
        <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
      </div>
      <div className="as-legend" style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="as-legend-item">
          <span className="as-legend-dot as-legend-dot--manual" />
          Manual — trending down as classes adopted taps
        </div>
        <div className="as-legend-item">
          <span className="as-legend-dot as-legend-dot--nfc" />
          NFC — flat, near-instant from week one
        </div>
      </div>

      {/* Criteria bars */}
      <div className="as-criteria">
        {criteria.map(({ label, pct }) => (
          <div key={label} className="as-criteria-row">
            <span className="as-criteria-label">{label}</span>
            <div className="as-criteria-track">
              <motion.div
                className="as-criteria-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={viewport}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            <span className="as-criteria-score">{pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
function AttendSmart() {
  const [activeId, setActiveId] = useState('understand');
  const observerRef = useRef(null);
  const activeIdRef = useRef('understand');

  useEffect(() => {
    const sections = PHASES.map(p => document.getElementById(p.id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          activeIdRef.current = visible[0].target.id;
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(s => observerRef.current.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const activeIndex = PHASES.findIndex(p => p.id === activeId);
  const activePhase = PHASES[activeIndex];

  const goPrev = () => {
    const idx = PHASES.findIndex(p => p.id === activeIdRef.current);
    if (idx > 0) scrollTo(PHASES[idx - 1].id);
  };

  const goNext = () => {
    const idx = PHASES.findIndex(p => p.id === activeIdRef.current);
    if (idx < PHASES.length - 1) scrollTo(PHASES[idx + 1].id);
  };

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageTransition}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="cs-hero">
        <motion.div className="cs-hero-left" variants={slideLeft} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <p className="cs-breadcrumb">
            <Link to="/" className="cs-breadcrumb-link">Home</Link>
            {' / '}
            <Link
              to="/"
              className="cs-breadcrumb-link"
              onClick={() => setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 350)}
            >
              Projects
            </Link>
            {' / '}
            <span>AttendSmart</span>
          </p>
          <div className="cs-hero-tags">
            <span className="tag">NFC</span>
            <span className="tag">Web app</span>
            <span className="tag">Mobile app</span>
          </div>
          <h1 className="cs-hero-title">
            An NFC-based attendance system that gets schools out of the paper logbook.
          </h1>
          <p className="cs-hero-desc">
            AttendSmart replaces roll call with a tap. Students check into class with an
            NFC-enabled ID, faculty get a live dashboard instead of a clipboard, and admins
            see who's in the building without waiting for the day to end. Built solo as a
            research-first UI project, from classroom observation to a tested prototype.
          </p>
          <motion.div className="cs-hero-meta" variants={staggerContainer(0.1, 0.4)} initial="hidden" animate="visible">
            {[
              { label: 'Role',        value: 'Researcher & UI Designer' },
              { label: 'Timeline',    value: '1 Month'                  },
              { label: 'Tools',       value: 'Figma · Google Forms'     },
              { label: 'Deliverables',value: 'UI Prototypes'            },
            ].map(({ label, value }) => (
              <motion.div key={label} className="cs-meta-item" variants={staggerItem}>
                <span className="cs-meta-label">{label}</span>
                <span className="cs-meta-value">{value}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="cs-hero-right" variants={slideRight} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <img src={FirstImg} alt="AttendSmart dashboard and tap-in screen" className="cs-hero-img" loading="eager" />
        </motion.div>
      </section>

      {/* ── SIDEBAR + CONTENT ── */}
      <div className="cs-layout">
        <motion.aside className="cs-sidebar" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <p className="cs-sidebar-project">AttendSmart</p>
          <nav className="cs-sidenav">
            {PHASES.map(({ id, number, label }) => (
              <button
                key={id}
                className={`cs-sidenav-item${activeId === id ? ' cs-sidenav-item--active' : ''}`}
                onClick={() => scrollTo(id)}
                aria-current={activeId === id ? 'true' : undefined}
              >
                <span className="cs-sidenav-num">{number}</span>
                <span className="cs-sidenav-label">{label}</span>
              </button>
            ))}
          </nav>
        </motion.aside>

        <main className="cs-content">

          {/* ════ 01 UNDERSTAND ════ */}
          <section id="understand" className="cs-phase">
            <div className="cs-phase-watermark">UNDERSTAND</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">01 / 06</span>
              <h3 className="cs-phase-name">UNDERSTAND</h3>
            </motion.div>

            <PhaseBlock
              subLabel="CONTEXT"
              title="A routine that hadn't changed in decades."
              body="Most classrooms still take attendance the same way they did before smartphones existed — a logbook passed row to row, or a teacher calling names aloud while 30 to 40 students wait. It's a small tax paid every single period, and it compounds across a school day, a semester, a school year."
              visual={<img src={UnderstandImg} alt="Roll call being replaced by a digital dashboard" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="PROBLEM"
              title="Roll call had three costs, and none were visible anywhere."
              body="Every period lost to calling names is a period of instruction that doesn't come back. Paper logs are easy to misplace and hard to search. And by the time an admin office needed to know who was actually present, the record was already a day old."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: 'Class Time',       sub: 'lost to manual roll call',            badge: 'RECURRING', variant: 'danger'  },
                    { title: 'Attendance Records', sub: 'paper, unsearchable, easy to lose', badge: 'UNRELIABLE', variant: 'danger' },
                    { title: 'Admin Visibility', sub: 'no same-day view of the building',    badge: 'DELAYED',   variant: 'danger'  },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 02 RESEARCH ════ */}
          <section id="research" className="cs-phase">
            <div className="cs-phase-watermark">RESEARCH</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">02 / 06</span>
              <h3 className="cs-phase-name">RESEARCH</h3>
            </motion.div>

            <PhaseBlock
              subLabel="METHOD"
              title="A time-motion study, not just interviews."
              body="Because the core problem was time lost to a routine, the study had to measure that routine directly — not just ask people how they felt about it. Classroom observation set the baseline; interviews and a short survey filled in the why."
              extra={
                <ul className="cs-bullet-list">
                  <li>Sat in on and timed roll call across small, medium, and large class sections.</li>
                  <li>Interviewed faculty about their current process and its friction points.</li>
                  <li>Surveyed students on how roll call affected their sense of class time.</li>
                </ul>
              }
              visual={<BarChart />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="RESPONDENTS"
              title="26 people, split across the people who take attendance and the people who live with the record."
              body="Participants were chosen so the study covered both ends of the process: the people calling roll every day, and the people who'd eventually depend on the record it produced."
              statsVariant
              flip
              visual={
                <StatGrid stats={[
                  { number: '6',  label: 'Faculty / Teachers'     },
                  { number: '16', label: 'Students'               },
                  { number: '4',  label: 'Registrar / Admin Staff' },
                  { number: '3',  label: 'Class sizes observed'   },
                ]} />
              }
            />
          </section>

          {/* ════ 03 DEFINE ════ */}
          <section id="define" className="cs-phase">
            <div className="cs-phase-watermark">DEFINE</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">03 / 06</span>
              <h3 className="cs-phase-name">DEFINE</h3>
            </motion.div>

            <PhaseBlock
              subLabel="THE GAP"
              title="Attendance was being recorded. It just wasn't being seen."
              body="The data existed, on paper, every day. What was missing was a way to move it from a classroom logbook to anyone who needed it — instantly, and without a second round of manual entry. The gap wasn't recording attendance; it was surfacing it in time to matter."
              visual={
                <motion.div className="cs-objective-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
                  <span className="cs-objective-label">STUDY OBJECTIVES</span>
                  <p className="cs-objective-body">
                    Design a tap-in system that logs attendance the moment a student arrives,
                    gives faculty a live view of who's present, and gives admins a same-day,
                    searchable record — evaluated for how much time it actually saves and how
                    reliably it captures every tap.
                  </p>
                </motion.div>
              }
            />
          </section>

          {/* ════ 04 STRATEGY ════ */}
          <section id="strategy" className="cs-phase">
            <div className="cs-phase-watermark">STRATEGY</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">04 / 06</span>
              <h3 className="cs-phase-name">STRATEGY</h3>
            </motion.div>

            <PhaseBlock
              subLabel="ACCESS MODEL"
              title="Three roles, one shared record."
              body="Every tap writes to a single source of truth. What each role sees is scoped to what they're responsible for — students confirm their own tap, faculty see their classroom, admins see the building."
              visual={
                <motion.div
                  className="cs-role-grid"
                  variants={staggerContainer(0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  {[
                    { name: 'Student', desc: 'Taps in, confirms their own record'   },
                    { name: 'Faculty', desc: 'Live roster + manual override'        },
                    { name: 'Admin',   desc: 'Building-wide reports, exports'       },
                  ].map(({ name, desc }) => (
                    <motion.div key={name} className="cs-role-card" variants={staggerItem}>
                      <span className="cs-role-name">{name}</span>
                      <span className="cs-role-desc">{desc}</span>
                    </motion.div>
                  ))}
                </motion.div>
              }
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="MODULES"
              title="Three modules, one motion: tap, confirm, record."
              body="NFC Tap-In, Live Dashboard, and Attendance Reports all trace back to the same event — a card touching a reader — so nothing needs to be entered twice."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: 'NFC Tap-In',         sub: 'card read → identity matched → timestamp logged', badge: 'INSTANT',   variant: 'success'  },
                    { title: 'Live Dashboard',      sub: 'faculty view updates in real time',              badge: 'REAL-TIME', variant: 'success'  },
                    { title: 'Attendance Reports',  sub: 'searchable, exportable, per class or building',  badge: 'SAME-DAY',  variant: 'teal'     },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 05 DESIGN ════ */}
          <section id="design" className="cs-phase">
            <div className="cs-phase-watermark">DESIGN</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">05 / 06</span>
              <h3 className="cs-phase-name">DESIGN</h3>
            </motion.div>

            <PhaseBlock
              subLabel="SCREENS"
              title="One dashboard, built to be glanced at, not read."
              body="The faculty dashboard surfaces who's present, who's late, and who's missing at a glance — no scrolling through a list to find a name. The tap-in screen gives students a one-second confirmation instead of silence, so nobody's left wondering if it worked."
              visual={<img src={DesignImg} alt="AttendSmart tap-in confirmation and faculty dashboard" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="TAP-IN FLOW"
              title="Three steps from card to record."
              body="Every tap moves through the same sequence, so a student never has to think about whether it registered."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: '1 · Tap card',           sub: 'student holds ID near the classroom reader',       badge: '0.3s',  variant: 'step'    },
                    { title: '2 · Match & log',         sub: 'system matches ID, timestamps the entry',          badge: 'AUTO',  variant: 'step'    },
                    { title: '3 · Dashboard updates',   sub: 'faculty view reflects the tap immediately',        badge: 'LIVE',  variant: 'success' },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 06 VALIDATION ════ */}
          <section id="validation" className="cs-phase">
            <div className="cs-phase-watermark">VALIDATION</div>
            <motion.div className="cs-phase-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <span className="cs-phase-number">06 / 06</span>
              <h3 className="cs-phase-name">VALIDATION</h3>
            </motion.div>

            <motion.div
              className="cs-phase-text"
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              style={{ marginBottom: '2.5rem' }}
            >
              <span className="cs-sub-label">RESULTS</span>
              <h2 className="cs-block-title">Roll call dropped from minutes to seconds — and taps rarely failed.</h2>
              <p className="cs-block-body">
                The prototype was tested with the same faculty and students observed during research,
                running simulated tap-ins against the timed baseline from the study.
              </p>
            </motion.div>

            {/* Two viz cards side by side */}
            <motion.div
              className="as-viz-grid"
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <DonutChart />
              <SpeedCard />
            </motion.div>
          </section>

        </main>
      </div>

      <Footer />

      {/* ── Mobile floating phase pill ── */}
      <motion.div
        className="cs-phase-pill"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="cs-pill-label">
          <span className="cs-pill-number">{activePhase.number} / 06</span>
          <span className="cs-pill-name">{activePhase.label}</span>
        </div>
        <div className="cs-pill-arrows">
          <button className="cs-pill-btn" onClick={goPrev} disabled={activeIndex === 0} aria-label="Previous section">‹</button>
          <button className="cs-pill-btn" onClick={goNext} disabled={activeIndex === PHASES.length - 1} aria-label="Next section">›</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AttendSmart;
