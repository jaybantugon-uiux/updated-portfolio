import { Link } from 'react-router-dom';
import { useState, useRef, useCallback } from 'react';
import '../styles/Home.css';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Tulip from '../assets/Tulip.webp';
import DesignsRUs from '../assets/DesignsRUs-Hero-Projects.webp';
import AttendSmart from '../assets/AttendSmart-Hero-Projects.webp';
import Candy from '../assets/Candy-Hero-Projects.webp';
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

/* ─── Project image with cursor-following "View Case Study" label ─── */
function ProjectImage({ src, alt, to }) {
  const [pos, setPos]         = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <Link to={to} className="project-image-link">
      <div
        ref={ref}
        className="project-image"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMove}
      >
        <img src={src} alt={alt} loading="lazy" />

        {/* Dark overlay */}
        <motion.div
          className="project-image-overlay"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Cursor-following label */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="project-image-label"
              style={{ left: pos.x, top: pos.y }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              View Case Study
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}

/* ─── Hero title letter-by-letter animation ─── */
const TITLE = 'Jay Bantugon';
const letterVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 + i * 0.06 },
  }),
};

/* Entry animations */
const tulipTopEntry = {
  hidden: { opacity: 0, y: -20, rotate: -25 },
  visible: {
    opacity: 0.9,
    y: 0,
    rotate: -15,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 },
  },
};

const tulipBottomEntry = {
  hidden: { opacity: 0, y: 20, rotate: 170 },
  visible: {
    opacity: 0.9,
    y: 0,
    rotate: 180,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 },
  },
};

/* ─── Tulip idle float ─── */
function FloatingTulip({ src, className, entryVariants, floatY, floatDuration, floatDelay }) {
  return (
    <motion.div
      variants={entryVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      <motion.img
        src={src}
        alt="Tulip"
        className={className}
        animate={{ y: floatY }}
        transition={{
          y: {
            duration: floatDuration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: floatDelay,
          },
        }}
      />
    </motion.div>
  );
}

/* ─── Hero with cursor parallax on title ─── */
function HeroSection() {
  const containerRef = useRef(null);
  const [titleHovered, setTitleHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const titleX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const titleY = useTransform(springY, [-0.5, 0.5], [-5, 5]);

  const onMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      id="home"
      className="home"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="home-content">
        <FloatingTulip
          src={Tulip}
          className="tulip-top"
          entryVariants={tulipTopEntry}
          floatY={[-7, 5]}
          floatDuration={3.2}
          floatDelay={0}
        />

        {/* Title stack — Baybayin underneath, Latin on top */}
        <motion.div
          className="home-title-stack"
          style={{ x: titleX, y: titleY }}
          onMouseEnter={() => setTitleHovered(true)}
          onMouseLeave={() => setTitleHovered(false)}
        >
          {/* Layer 1: Baybayin — always present, fades out on hover */}
          <motion.h1
            className="home-title home-title--baybayin"
            animate={{ opacity: titleHovered ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            aria-hidden={titleHovered}
          >
            {TITLE.split('').map((char, i) =>
              char === ' ' ? (
                <span key={i} style={{ display: 'inline-block', width: '0.3em' }} />
              ) : (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              )
            )}
          </motion.h1>

          {/* Layer 2: DM Sans Latin — hidden by default, fades in on hover */}
          <motion.h1
            className="home-title home-title--latin"
            animate={{ opacity: titleHovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            aria-hidden={!titleHovered}
          >
            {TITLE}
          </motion.h1>
        </motion.div>

        <FloatingTulip
          src={Tulip}
          className="tulip-bottom"
          entryVariants={tulipBottomEntry}
          floatY={[-5, 7]}
          floatDuration={3.6}
          floatDelay={0.4}
        />
      </div>
    </div>
  );
}

/* ─── Project card hover ─── */
function ProjectCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`project-card${className ? ` ${className}` : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Navbar />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── PROJECT INTRO ── */}
      <div className="project-section">
        <motion.h1
          className="project-title"
          variants={slideLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          Good design starts by <span className="highlight">listening</span>, not sketching.
        </motion.h1>

        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p>
            I'm Jay — a UI/UX designer who spends more time in user interviews than in Figma.
            Below are three products I shaped end to end, from research through shipped screens.
          </p>
          <h6>03 — case studies</h6>
          <h6>2022 - 2026 — active practice</h6>
          <h6>open — for work</h6>
        </motion.div>
      </div>

      {/* ── ACADEMIC PROJECTS ── */}
      <div id="projects" className="academic-projects">
        <motion.div
          className="projects-label"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h3>ACADEMIC PROJECTS</h3>
          <div className="label-line"></div>
        </motion.div>

        {/* Project 1: DESIGNS R' US */}
        <ProjectCard>
          <motion.div className="project-content" variants={slideLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="project-tags">
              <span className="tag">PMS</span>
              <span className="tag">Web app</span>
              <span className="tag">Dashboard</span>
            </div>
            <h2 className="project-name">DESIGNS R' US</h2>
            <p className="project-description">
              A project management platform for an interior design company focused on improving collaboration, task tracking, and updates.
            </p>
            <div className="project-info">
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">UI/UX Designer &amp; Frontend Developer</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timeline</span>
                <span className="info-value">10 Months</span>
              </div>
              <div className="info-item">
                <span className="info-label">Deliverables</span>
                <span className="info-value">Functioning System</span>
              </div>
            </div>
            <Link to="/designs-rus" className="view-case-study">View case study →</Link>
          </motion.div>
          <motion.div className="project-image" variants={slideRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <ProjectImage src={DesignsRUs} alt="DESIGNS R' US" to="/designs-rus" />
          </motion.div>
        </ProjectCard>

        <motion.div className="projects-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

        {/* Project 2: ATTENDSMART */}
        <ProjectCard className="alternate">
          <motion.div className="project-image" variants={slideLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <ProjectImage src={AttendSmart} alt="ATTENDSMART" to="/attendsmart" />
          </motion.div>
          <motion.div className="project-content" variants={slideRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="project-tags">
              <span className="tag">NFC</span>
              <span className="tag">Web app</span>
              <span className="tag">Mobile app</span>
            </div>
            <h2 className="project-name">ATTENDSMART</h2>
            <p className="project-description">
              An NFC-based attendance system for schools — students tap in, faculty get live dashboards, and the paper logbook finally retires.
            </p>
            <div className="project-info">
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">Researcher &amp; UI Designer</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timeline</span>
                <span className="info-value">1 Month</span>
              </div>
              <div className="info-item">
                <span className="info-label">Deliverables</span>
                <span className="info-value">UI Prototypes</span>
              </div>
            </div>
            <Link to="/attendsmart" className="view-case-study">View case study →</Link>
          </motion.div>
        </ProjectCard>

        <motion.div className="projects-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />

        {/* Project 3: CANDY */}
        <ProjectCard>
          <motion.div className="project-content" variants={slideLeft} initial="hidden" whileInView="visible" viewport={viewport}>
            <div className="project-tags">
              <span className="tag">Mobile app</span>
              <span className="tag">Travel</span>
              <span className="tag">Booking</span>
            </div>
            <h2 className="project-name">CANDY</h2>
            <p className="project-description">
              A hotel discovery app focused on trust signals at the moment of booking — real amenity photos, transparent pricing, and a room finder that filters by mood, not just star rating.
            </p>
            <div className="project-info">
              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">UI Designer</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timeline</span>
                <span className="info-value">3 Weeks</span>
              </div>
              <div className="info-item">
                <span className="info-label">Deliverables</span>
                <span className="info-value">UI Prototypes</span>
              </div>
            </div>
            <Link to="/candy" className="view-case-study">View case study →</Link>
          </motion.div>
          <motion.div className="project-image" variants={slideRight} initial="hidden" whileInView="visible" viewport={viewport}>
            <ProjectImage src={Candy} alt="CANDY" to="/candy" />
          </motion.div>
        </ProjectCard>

        <motion.div className="projects-divider" variants={fadeIn} initial="hidden" whileInView="visible" viewport={viewport} />
      </div>

      {/* ── SKILLS CAROUSEL ── */}
      <motion.div
        className="skills-section"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <div className="skills-carousel">
          <div className="skills-track">

            {/* ── set A ── */}
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Usability Testing
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              Wireframing &amp; Prototyping
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
              Design Systems &amp; IA
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Frontend (HTML/CSS/JS)
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              UI Design
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              Accessibility
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              User-Centered
            </span>

            {/* ── set B (duplicate for seamless loop) ── */}
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Usability Testing
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              Wireframing &amp; Prototyping
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
              Design Systems &amp; IA
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Frontend (HTML/CSS/JS)
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              UI Design
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              Accessibility
            </span>
            <span className="skill-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              User-Centered
            </span>

          </div>
        </div>
      </motion.div>

      {/* ── PERSONAL PROJECTS ── */}
      <div className="personal-projects">
        <div className="personal-header">
          <motion.h1
            className="personal-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Smaller builds, made on my own time.
          </motion.h1>
          <div className="personal-projects-header">
            <motion.div
              className="projects-label"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              <h3>PERSONAL PROJECTS</h3>
              <div className="label-line"></div>
            </motion.div>
            <motion.span
              className="scroll-indicator"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              Scroll →
            </motion.span>
          </div>
        </div>

        <div className="personal-projects-scroll">
          <motion.div
            className="personal-projects-track"
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {[
              {
                title: 'UNTITLED 01',
                desc: 'Something in the works. Details soon.',
                tags: ['TBD'],
                year: '2026',
                duration: 'Coming soon',
              },
              {
                title: 'UNTITLED 02',
                desc: 'Something in the works. Details soon.',
                tags: ['TBD'],
                year: '2026',
                duration: 'Coming soon',
              },
              {
                title: 'UNTITLED 03',
                desc: 'Something in the works. Details soon.',
                tags: ['TBD'],
                year: '2026',
                duration: 'Coming soon',
              },
              {
                title: 'UNTITLED 04',
                desc: 'Something in the works. Details soon.',
                tags: ['TBD'],
                year: '2026',
                duration: 'Coming soon',
              },
            ].map(({ title, desc, tags, year, duration }) => (
              <motion.div key={title} className="personal-card" variants={staggerItem}>
                <div className="personal-card-image placeholder"></div>
                <div className="personal-card-tags">
                  {tags.map(t => <span key={t} className="personal-tag">{t}</span>)}
                </div>
                <h3 className="personal-card-title">{title}</h3>
                <p className="personal-card-description">{desc}</p>
                <div className="personal-card-divider"></div>
                <div className="personal-card-footer">
                  <span className="personal-year">{year}</span>
                  <span className="personal-duration">{duration}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </motion.div>
  );
}

export default Home;
