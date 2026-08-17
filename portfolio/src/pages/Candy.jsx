import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImg from '../assets/Candy-Hero-Projects.webp';
import DesignImg from '../assets/Candy(Design).webp';
import UnderstandImg from '../assets/Candy(Understand).webp';
import FirstImg from '../assets/Candy(1st).webp';
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

/* ─── Stat grid ─── */
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

/* ─── Radar / compass chart ─── */
function CompassChart() {
  const cx = 120, cy = 120, r = 110;
  // 6 axes, starting at top, going clockwise
  const axes = [
    { label: 'Photo Trust',       angle: -90  },
    { label: 'Price Clarity',     angle: -30  },
    { label: 'Room Fit',          angle:  30  },
    { label: 'Booking Confidence',angle:  90  },
    { label: 'Checkout Trust',    angle: 150  },
    { label: 'Filter Relevance',  angle: 210  },
  ];

  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  // OTA baseline scores (out of 110)
  const otaScores   = [45, 35, 50, 48, 38, 43];
  // Candy scores
  const candyScores = [105, 95, 100, 95, 88, 82];

  const toPoints = (scores) =>
    scores
      .map((s, i) => {
        const { x, y } = toXY(axes[i].angle, s);
        return `${x},${y}`;
      })
      .join(' ');

  // Needle towards Photo Trust (top)
  const needleTip = toXY(-90, 100);

  return (
    <motion.div
      className="as-viz-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <span className="cs-sub-label">CONFIDENCE</span>
      <p className="as-chart-title">Trust rating by screen — plotted like a travel compass</p>

      <div className="candy-compass-wrap">
        <svg width="260" height="260" viewBox="-10 -10 260 280" style={{ overflow: 'visible' }}>
          {/* Rings */}
          {[40, 75, 110].map(r => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={r === 110 ? '#2a2a2a' : '#1e1e1e'} strokeWidth="1" />
          ))}

          {/* Spokes + dot labels */}
          {axes.map(({ label, angle }, i) => {
            const tip = toXY(angle, 110);
            const lbl = toXY(angle, 126);
            const anchor =
              Math.abs(angle) === 90 ? 'middle'
              : angle > -90 && angle < 90 ? 'start'
              : 'end';
            return (
              <g key={i}>
                <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#1e1e1e" />
                <circle cx={tip.x} cy={tip.y} r="2.5" fill="#555555" />
                <text
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="#555555"
                  fontSize="8.5"
                  fontFamily="DM Sans, Inter"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* OTA baseline polygon */}
          <polygon
            points={toPoints(otaScores)}
            fill="#2a2a2a"
            fillOpacity="0.5"
            stroke="#2a2a2a"
            strokeWidth="1.5"
          />

          {/* Candy polygon — animate fill-opacity */}
          <motion.polygon
            points={toPoints(candyScores)}
            fill="#D4AF37"
            fillOpacity="0"
            stroke="#D4AF37"
            strokeWidth="2"
            initial={{ fillOpacity: 0 }}
            whileInView={{ fillOpacity: 0.18 }}
            viewport={viewport}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Compass needle */}
          <polygon
            points={`${cx},${cy} ${cx - 5},${cy - 55} ${cx},${needleTip.y} ${cx + 5},${cy - 55}`}
            fill="#D4AF37"
            fillOpacity="0.85"
          />
          <circle cx={cx} cy={cy} r="5" fill="#121212" stroke="#D4AF37" strokeWidth="2" />
        </svg>

        <div className="candy-compass-legend">
          <div className="as-legend-item">
            <span className="as-legend-dot" style={{ backgroundColor: '#D4AF37' }} />
            Candy prototype
          </div>
          <div className="as-legend-item">
            <span className="as-legend-dot" style={{ backgroundColor: '#2a2a2a', border: '1px solid #555555' }} />
            Typical OTA flow
          </div>
          <p className="candy-compass-note">
            "True north" — the needle settles on real amenity photos, the signal testers trusted most.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Boarding-pass comparison card ─── */
function BoardingPass() {
  return (
    <motion.div
      className="as-viz-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ delay: 0.1 }}
    >
      <span className="cs-sub-label">BOOKING FOLLOW-THROUGH</span>
      <p className="as-chart-title">Who booked without checking another app first</p>

      <div className="candy-ticket-row">
        {/* OTA stub */}
        <div className="candy-ticket-stub candy-ticket-stub--muted">
          <span className="candy-ticket-label">Typical OTA</span>
          <motion.div
            className="candy-ticket-num"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            34%
          </motion.div>
          <p className="candy-ticket-cap">booked directly, no other app checked first</p>
          <span className="candy-stamp candy-stamp--muted">Unconfirmed</span>
        </div>

        {/* Dashed divider */}
        <div className="candy-ticket-divider" />

        {/* Candy stub */}
        <div className="candy-ticket-stub candy-ticket-stub--hero">
          <span className="candy-ticket-label">Candy Prototype</span>
          <motion.div
            className="candy-ticket-num candy-ticket-num--gold"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          >
            78%
          </motion.div>
          <p className="candy-ticket-cap">booked directly, no other app checked first</p>
          <span className="candy-stamp candy-stamp--gold">Confirmed</span>
        </div>
      </div>

      <p className="candy-ticket-foot">
        Measured across returning think-aloud testers, same booking task, both flows
      </p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
function Candy() {
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
            <span>Candy</span>
          </p>
          <div className="cs-hero-tags">
            <span className="tag">Mobile app</span>
            <span className="tag">Travel</span>
            <span className="tag">Booking</span>
          </div>
          <h1 className="cs-hero-title">
            A hotel discovery app built on trust signals, not star ratings.
          </h1>
          <p className="cs-hero-desc">
            Candy is a hotel booking app for the moment right before someone commits — the scroll
            where a listing photo, a price, or a room description either earns confidence or loses
            it. Real amenity photos, transparent pricing, and a mood-based room finder replace the
            guesswork most booking apps leave to the guest.
          </p>
          <motion.div className="cs-hero-meta" variants={staggerContainer(0.1, 0.4)} initial="hidden" animate="visible">
            {[
              { label: 'Role',        value: 'UI Designer'   },
              { label: 'Timeline',    value: '3 Weeks'       },
              { label: 'Tools',       value: 'Figma'         },
              { label: 'Deliverables',value: 'UI Prototypes' },
            ].map(({ label, value }) => (
              <motion.div key={label} className="cs-meta-item" variants={staggerItem}>
                <span className="cs-meta-label">{label}</span>
                <span className="cs-meta-value">{value}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="cs-hero-right" variants={slideRight} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <img src={FirstImg} alt="Candy hotel discovery app" className="cs-hero-img" loading="eager" />
        </motion.div>
      </section>

      {/* ── SIDEBAR + CONTENT ── */}
      <div className="cs-layout">
        <motion.aside className="cs-sidebar" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <p className="cs-sidebar-project">Candy</p>
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
              title="A star rating doesn't tell you what the room actually looks like."
              body="Most booking apps optimize for browsing — endless listings, aggregate scores, stock-style photography. But the moment that actually decides a booking is narrower: does this specific room look like what's promised, and is the price on the button the price you'll pay. That moment is where most apps go quiet."
              visual={<img src={UnderstandImg} alt="Person comparing hotel amenity photos before booking" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="PROBLEM"
              title="Guests weren't unsure about hotels. They were unsure about the listing."
              body="Star ratings average out experiences that don't apply to the room being booked. Listing photos are often stock or years old. And prices shown on the search page rarely match the price at checkout, once fees are added."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: 'Amenity Photos',  sub: 'stock imagery, not the actual room',        badge: 'LOW TRUST',  variant: 'danger'  },
                    { title: 'Displayed Price', sub: 'changes by checkout, fees hidden',           badge: 'MISLEADING', variant: 'danger'  },
                    { title: 'Room Fit',        sub: 'star rating, not the traveler\'s mood',      badge: 'GENERIC',    variant: 'warning' },
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
              title="A teardown of existing apps, paired with real booking sessions."
              body="Because the problem lived in a specific moment of the flow, the research had to watch that moment happen — not just ask about it afterward. A comparative teardown set the baseline against existing OTA apps; think-aloud booking sessions showed where hesitation actually occurred."
              extra={
                <ul className="cs-bullet-list">
                  <li>Audited five booking apps for how each handled photos, pricing, and filters.</li>
                  <li>Ran think-aloud sessions, asking travelers to book a real stay and narrate hesitation.</li>
                  <li>Logged the exact screen and reason behind every pause longer than five seconds.</li>
                </ul>
              }
              visual={
                <StatGrid stats={[
                  { number: '5',  label: 'Booking apps audited'       },
                  { number: '9',  label: 'Think-aloud sessions'       },
                  { number: '31', label: 'Hesitation points logged'   },
                  { number: '3',  label: 'Recurring trust gaps found' },
                ]} />
              }
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="FINDING"
              title="Hesitation clustered around three screens, not the whole flow."
              body="Travelers moved through search results quickly. They slowed down — and second-guessed themselves — at the amenity photos, the price breakdown, and the room selection step. Fixing those three screens mattered more than redesigning the whole app."
              flip
              visual={
                <StackedRows
                  rows={[
                    { title: 'Amenity Photos',  sub: '14 of 31 hesitation points', badge: 'HIGHEST',  variant: 'danger'  },
                    { title: 'Price Breakdown', sub: '11 of 31 hesitation points', badge: 'HIGH',     variant: 'warning' },
                    { title: 'Room Selection',  sub: '6 of 31 hesitation points',  badge: 'MODERATE', variant: 'info'    },
                  ]}
                />
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
              title="The information existed. It just wasn't shown at the moment it was needed."
              body="Hotels already had real photos, real fee structures, and real room details somewhere in their systems. The gap wasn't missing data — it was that none of it surfaced at the three screens where travelers were actually deciding whether to trust the booking."
              visual={
                <motion.div className="cs-objective-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
                  <span className="cs-objective-label">STUDY OBJECTIVES</span>
                  <p className="cs-objective-body">
                    Design a booking flow that surfaces real amenity photos, an all-in price before
                    checkout, and a room finder that matches how a traveler wants to feel — not just
                    how many stars a hotel has — evaluated by whether it reduced hesitation at the
                    three screens research identified.
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
              subLabel="TRUST MODEL"
              title="Three pillars, mapped directly to the three points of hesitation."
              body="Instead of a general redesign, each pillar was scoped to fix exactly one moment research flagged — so every design decision traced back to a specific hesitation, not a general assumption about 'trust.'"
              visual={
                <motion.div
                  className="cs-role-grid"
                  variants={staggerContainer(0.08)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  {[
                    { name: 'Real Photos',         desc: 'User- and property-verified amenity images, no stock'       },
                    { name: 'Transparent Pricing',  desc: 'All-in price shown at search, not just at checkout'        },
                    { name: 'Mood-Based Finder',    desc: 'Filters by feel — quiet, social, scenic — not star count'  },
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
              subLabel="BOOKING FLOW"
              title="Every pillar shows up before the tap, not after it."
              body="Search, listing, and checkout each carry one trust signal forward, so the price and photos a traveler sees never change on them later in the flow."
              flip
              visual={
                <StackedRows
                  connector="↓"
                  rows={[
                    { title: 'Search',   sub: 'mood filter narrows results, all-in price shown upfront',    badge: 'FILTER',  variant: 'info'    },
                    { title: 'Listing',  sub: 'verified amenity photo grid, no stock substitutions',        badge: 'VERIFY',  variant: 'success' },
                    { title: 'Checkout', sub: 'price matches what was shown at search, line by line',       badge: 'CONFIRM', variant: 'teal'    },
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
              title="A room finder that asks how you want to feel, not just where you want to stay."
              body="The mood filter replaces a star-rating slider with tags like quiet, social, and scenic, pulled from the same verified photo and amenity data shown on the listing page — so the filter and the listing never contradict each other."
              visual={<img src={DesignImg} alt="Candy mood-based room finder and amenity photo grid" className="cs-visual-img" loading="lazy" />}
            />

            <motion.div className="cs-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

            <PhaseBlock
              subLabel="PRICE BREAKDOWN"
              title="Three lines, shown once, never revised."
              body="The price a traveler sees at search is the exact structure carried through to checkout — nothing new appears at the last step."
              flip
              visual={
                <StackedRows
                  rows={[
                    { title: '1 · Room rate',    sub: 'base nightly price, shown at search',           badge: 'LOCKED',    variant: 'success' },
                    { title: '2 · Taxes & fees', sub: 'itemized, not bundled into "service fee"',      badge: 'ITEMIZED',  variant: 'info'    },
                    { title: '3 · Total due',    sub: 'matches the number shown before the tap',       badge: 'GUARANTEED',variant: 'teal'    },
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
              <h2 className="cs-block-title">Trust went up at every hesitation point research flagged.</h2>
              <p className="cs-block-body">
                The prototype was tested with returning think-aloud participants, comparing their
                confidence at each of the three flagged screens against the original OTA-style flow.
              </p>
            </motion.div>

            <motion.div
              className="as-viz-grid"
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <CompassChart />
              <BoardingPass />
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

export default Candy;
