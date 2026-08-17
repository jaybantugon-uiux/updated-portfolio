import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImg from '../assets/DesignsRUs-Hero-Projects.webp';
import DesignImg from '../assets/DesignsRUs(Design).webp';
import UnderstandImg from '../assets/DesignsRUs(Understand).webp';
import FirstImg from '../assets/DesignsRUs(1st).webp';
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

/* ─── Reusable stacked-row artifact ─── */
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

/* ─── Phase block wrapper ─── */
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

function DesignsRUs() {
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
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Navbar />

      {/* ── HERO ── */}
      <section className="cs-hero">
        <motion.div
          className="cs-hero-left"
          variants={slideLeft}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <p className="cs-breadcrumb">
            <Link to="/" className="cs-breadcrumb-link">Home</Link>
            {' / '}
            <Link to="/" className="cs-breadcrumb-link" onClick={() => setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 350)}>Projects</Link>
            {' / '}
            <span>Designs R' Us</span>
          </p>
          <div className="cs-hero-tags">
            <span className="tag">PMS</span>
            <span className="tag">Web app</span>
            <span className="tag">Dashboard</span>
          </div>
          <h1 className="cs-hero-title">
            A web-based project management system for an architectural &amp; interior
            design company.
          </h1>
          <p className="cs-hero-desc">
            Designs R' Us is an interior design firm that manages multiple active
            projects across architecture and interior work. The company lacked a
            unified system — tasks lived in email threads, project timelines were
            tracked in personal notebooks, and clients had no visibility into
            progress. I designed and built a full project management platform to
            replace that fragmented workflow.
          </p>
          <motion.div
            className="cs-hero-meta"
            variants={staggerContainer(0.1, 0.4)}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Role',        value: 'UI/UX Designer & Frontend Developer' },
              { label: 'Timeline',    value: '10 Months'                           },
              { label: 'Deliverables',value: 'Functioning System'                  },
            ].map(({ label, value }) => (
              <motion.div key={label} className="cs-meta-item" variants={staggerItem}>
                <span className="cs-meta-label">{label}</span>
                <span className="cs-meta-value">{value}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="cs-hero-right"
          variants={slideRight}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <img src={FirstImg} alt="Designs R' Us dashboard mockup" className="cs-hero-img" loading="eager" />
        </motion.div>
      </section>

      {/* ── SIDEBAR + CONTENT ── */}
      <div className="cs-layout">
        <motion.aside
          className="cs-sidebar"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <p className="cs-sidebar-project">Designs R' Us</p>
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
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">01 / 06</span>
              <h3 className="cs-phase-name">UNDERSTAND</h3>
            </motion.div>

            <PhaseBlock
              subLabel="CONTEXT"
              title="A company that had outgrown manual tracking."
              body="Design R Us handles architectural drawings, interior renovations, and construction-related work — three to five projects a quarter, each running three months or more. That volume had outgrown the spreadsheets and email threads holding it together."
              visual={<img src={UnderstandImg} alt="Team using the system" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="PROBLEM"
              title="The work had grown. The tracking hadn't."
              body="Every added project multiplied the number of places a status could go stale. Documentation was hard to manage, equipment was hard to locate, and there was no standardized way to know a project had actually been accepted and signed off."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: 'Documentation',     sub: 'spreadsheets, email, paper',    badge: 'MANUAL',    variant: 'danger'   },
                    { title: 'Equipment & Tools', sub: 'no centralized record',         badge: 'UNTRACKED', variant: 'danger'   },
                    { title: 'Project Status',    sub: 'assembled by hand, on request', badge: 'DELAYED',   variant: 'danger'   },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 02 RESEARCH ════ */}
          <section id="research" className="cs-phase">
            <div className="cs-phase-watermark">RESEARCH</div>
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">02 / 06</span>
              <h3 className="cs-phase-name">RESEARCH</h3>
            </motion.div>

            <PhaseBlock
              subLabel="METHOD"
              title="Quantitative research, gathered three ways."
              body="A mixed approach was used to satisfy the study's goals: descriptive research to baseline the agency's existing process, a survey sent to prospective users, and controlled system testing to measure task delegation, monitoring, and real-time collaboration under simulated conditions."
              extra={
                <ul className="cs-bullet-list">
                  <li>Interviews and observation, with written approval from the agency's operations executive.</li>
                  <li>Structured questionnaires distributed via Google Forms.</li>
                  <li>Results later benchmarked against ISO/IEC 25010:2023.</li>
                </ul>
              }
              visual={
                <StackedRows
                  connector="+"
                  rows={[
                    { title: 'Descriptive',  sub: 'baseline the current workflow', badge: 'INTERVIEWS',   variant: 'info'  },
                    { title: 'Survey',       sub: 'usability & satisfaction data', badge: 'GOOGLE FORMS', variant: 'info'  },
                    { title: 'Experimental', sub: 'simulated real-world testing',  badge: 'SYSTEM TEST',  variant: 'info'  },
                  ]}
                />
              }
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="RESPONDENTS"
              title="30 people, close to the actual work."
              body="Participants were chosen because their roles connect directly to project planning, task coordination, and communication — the exact areas the system needed to improve."
              statsVariant
              flip
              visual={
                <StatGrid stats={[
                  { number: '3',  label: 'Project Managers'  },
                  { number: '3',  label: 'Site Coordinators' },
                  { number: '2',  label: 'Accountants'       },
                  { number: '8+', label: 'Designers'         },
                ]} />
              }
            />
          </section>

          {/* ════ 03 DEFINE ════ */}
          <section id="define" className="cs-phase">
            <div className="cs-phase-watermark">DEFINE</div>
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">03 / 06</span>
              <h3 className="cs-phase-name">DEFINE</h3>
            </motion.div>

            <PhaseBlock
              subLabel="THE GAP"
              title="The data existed. Nothing tied it together."
              body="No shared record connected a task, a piece of equipment, or an expense back to the project — or the person waiting on it. Reporting stayed manual because there was nothing automatic to report from."
              visual={
                <motion.div
                  className="cs-objective-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  <span className="cs-objective-label">STUDY OBJECTIVES</span>
                  <p className="cs-objective-body">
                    Develop an efficient, user-friendly project management platform
                    that streamlines business processes, file management, project
                    monitoring, tools and equipment tracking, and purchase order
                    management for Design R Us — evaluated against ISO/IEC 25010:2023
                    for functional suitability, performance efficiency, interaction
                    capability, and reliability.
                  </p>
                </motion.div>
              }
            />
          </section>

          {/* ════ 04 STRATEGY ════ */}
          <section id="strategy" className="cs-phase">
            <div className="cs-phase-watermark">STRATEGY</div>
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">04 / 06</span>
              <h3 className="cs-phase-name">STRATEGY</h3>
            </motion.div>

            <PhaseBlock
              subLabel="ACCESS MODEL"
              title="Six roles, one RBAC framework."
              body="Built on Laravel, React, and MySQL, and developed under the Agile SDLC for iterative, feedback-driven delivery. Every account is scoped by role, with Auth0-backed email verification on registration."
              visual={
                <motion.div
                  className="cs-role-grid"
                  variants={staggerContainer(0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  {[
                    { name: 'Admin',            desc: 'Approves equipment, escalations'   },
                    { name: 'Project Manager',  desc: 'Creates projects, assigns tasks'   },
                    { name: 'Site Coordinator', desc: 'Field reports, equipment requests' },
                    { name: 'Finance Admin',    desc: 'Processes expense reports'         },
                    { name: 'Employee',         desc: 'Uploads & manages files'           },
                    { name: 'Client',           desc: 'Monitors project progress'         },
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
              title="Five modules, one connected record."
              body="Task Management, Project Monitoring, Equipment Monitoring, and Expense Liquidation all follow the same shape: someone submits or requests, someone else approves or flags, and the status updates everywhere at once."
              flip
              visual={
                <StackedRows
                  connector="+"
                  rows={[
                    { title: 'Task Management',     sub: 'PM assigns → Site Coordinator', badge: 'MODIFIED',  variant: 'warning'  },
                    { title: 'Project Monitoring',  sub: 'field reports, site photos',    badge: 'TRACKED',   variant: 'success'  },
                    { title: 'Equipment & Expense', sub: 'request → approve → log',       badge: 'AUDITABLE', variant: 'teal'     },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 05 DESIGN ════ */}
          <section id="design" className="cs-phase">
            <div className="cs-phase-watermark">DESIGN</div>
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">05 / 06</span>
              <h3 className="cs-phase-name">DESIGN</h3>
            </motion.div>

            <PhaseBlock
              subLabel="SCREENS"
              title="One dashboard, a consistent project setup."
              body="The Dashboard surfaces active projects, recent activity, notifications, and financial summaries in one view. Expense Liquidation lets users submit daily expenditures with attached receipts, File Management backs every upload to Google Drive automatically, and Equipment Monitoring tracks tool availability and maintenance status across projects."
              visual={<img src={DesignImg} alt="Dashboard screen" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="PROJECT SETUP FLOW"
              title="Three steps to a consistent project record."
              body="Every project starts the same way, so nothing gets entered freeform."
              flip
              visual={
                <StackedRows
                  connector="+"
                  rows={[
                    { title: '1 · Basic Details',     sub: 'name, client, dates, budget', badge: 'Step 1', variant: 'step' },
                    { title: '2 · Specifications',    sub: 'category, rooms, floor area', badge: 'Step 2', variant: 'step' },
                    { title: '3 · Schedule & Phases', sub: 'auto-generated, editable',    badge: 'Step 3', variant: 'step' },
                  ]}
                />
              }
            />
          </section>

          {/* ════ 06 VALIDATION ════ */}
          <section id="validation" className="cs-phase">
            <div className="cs-phase-watermark">VALIDATION</div>
            <motion.div
              className="cs-phase-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <span className="cs-phase-number">06 / 06</span>
              <h3 className="cs-phase-name">VALIDATION</h3>
            </motion.div>

            <PhaseBlock
              subLabel="RESULTS"
              title='Median "Agree" across every criterion.'
              body="End-users and IT/system development experts evaluated the finished system separately against ISO/IEC 25010:2023, using a 4-point scale. Expert reviewers confirmed the system met technical benchmarks for performance, security, and maintainability — interface polish was the clearest area flagged for the next iteration."
              visual={
                <motion.div
                  className="cs-sus-list"
                  variants={staggerContainer(0.1)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  {[
                    { label: 'Functional Suitability', score: 3,   max: 4 },
                    { label: 'Interaction Capability', score: 3,   max: 4 },
                    { label: 'Reliability',            score: 3,   max: 4 },
                    { label: 'Recoverability',         score: 3.5, max: 4 },
                    { label: 'Flexibility',            score: 3,   max: 4 },
                  ].map(({ label, score, max }) => (
                    <motion.div key={label} className="cs-sus-item" variants={staggerItem}>
                      <div className="cs-sus-header">
                        <span className="cs-sus-label">{label}</span>
                        <span className="cs-sus-score">{score} / {max}</span>
                      </div>
                      <div className="cs-sus-bar-track">
                        <motion.div
                          className="cs-sus-bar-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(score / max) * 100}%` }}
                          viewport={viewport}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              }
            />
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
          <button
            className="cs-pill-btn"
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label="Previous section"
          >‹</button>
          <button
            className="cs-pill-btn"
            onClick={goNext}
            disabled={activeIndex === PHASES.length - 1}
            aria-label="Next section"
          >›</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DesignsRUs;
