import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Routes that are case studies — Projects link highlights on these
const CASE_STUDY_ROUTES = ['/designs-rus', '/attendsmart', '/candy'];

const BACK_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const NAV_LINKS = [
  {
    label: 'Home',
    hash: 'home',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    hash: 'projects',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Contacts',
    hash: 'contacts',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Resume',
    hash: 'resume',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.25 + i * 0.07 },
  }),
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: 4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

function NavLink({ label, hash, icon, isActive, isPinned, onActivate, onClick }) {
  const [hovered, setHovered] = useState(false);
  const showIcon = hovered || isActive || isPinned;
  // On a case study page the Projects link shows a back arrow
  const displayIcon = isPinned ? BACK_ICON : icon;

  return (
    <span
      className={`navbar-link-inner${isActive || isPinned ? ' navbar-link-active' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        onActivate(hash);
        onClick();
      }}
      style={{ cursor: 'pointer' }}
    >
      <AnimatePresence mode="wait">
        {showIcon && (
          <motion.span
            key={isPinned ? 'back' : 'default'}
            className="navbar-link-icon"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {displayIcon}
          </motion.span>
        )}
      </AnimatePresence>
      <span>{label}</span>
    </span>
  );
}

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const isCaseStudy = CASE_STUDY_ROUTES.includes(pathname);
  const [activeHash, setActiveHash] = useState(null);

  const handleNav = (hash) => {
    if (hash === 'resume') {
      window.open('/Bantugon_Resume.pdf', '_blank', 'noopener,noreferrer');
      return;
    }

    if (isHome) {
      if (hash === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (hash === 'home') {
        navigate('/');
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      }
    }
  };

  return (
    <motion.div
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, pointerEvents: 'none' }}
    >
      <nav className="navbar" style={{ pointerEvents: 'auto' }}>
        <ul className="navbar-links">
          {NAV_LINKS.map(({ label, hash, icon }, i) => (
            <motion.li
              key={label}
              custom={i}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                label={label}
                hash={hash}
                icon={icon}
                isActive={activeHash === hash}
                isPinned={isCaseStudy && hash === 'projects'}
                onActivate={setActiveHash}
                onClick={() => handleNav(hash)}
              />
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}

export default Navbar;
