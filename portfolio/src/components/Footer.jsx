import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isHome = pathname === '/';

    const scrollTo = (id) => {
        if (isHome) {
            if (id === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                if (id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }
            }, 350);
        }
    };

    const openResume = () => {
        window.open('/Bantugon_Resume.pdf', '_blank', 'noopener,noreferrer');
    };

    return (
        <footer className="footer">
            <div className="footer-divider"></div>
            <div className="footer-content">

                <div className="footer-section footer-bio">
                    <Logo size={36} />
                    <h3 className="footer-name">Jay Louis Bantugon</h3>
                    <p className="footer-bio-text">
                        UI/UX designer focused on turning messy workflows into calm, useable systems.
                    </p>
                </div>

                {/* Site */}
                <div className="footer-section footer-links">
                    <h4 className="footer-section-title">Site</h4>
                    <ul className="footer-list">
                        <li>
                            <button className="footer-link-btn" onClick={() => scrollTo('home')}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button className="footer-link-btn" onClick={() => scrollTo('projects')}>
                                Projects
                            </button>
                        </li>
                        <li id="resume">
                            <button className="footer-link-btn" onClick={openResume}>
                                Resume
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Work */}
                <div className="footer-section footer-links">
                    <h4 className="footer-section-title">Work</h4>
                    <ul className="footer-list">
                        <li>
                            <Link to="/designs-rus" className="footer-link-btn">
                                Designs R' Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/attendsmart" className="footer-link-btn">
                                AttendSmart
                            </Link>
                        </li>
                        <li>
                            <Link to="/candy" className="footer-link-btn">
                                Candy
                            </Link>
                        </li>                    </ul>
                </div>

                {/* Contact */}
                <div id="contacts" className="footer-section footer-contact">
                    <h4 className="footer-section-title">Contact</h4>
                    <ul className="footer-list">
                        <li>
                            <span className="footer-link-btn footer-link-muted">jaylouisbantugon@gmail.com</span>
                        </li>
                        <li>
                            <span className="footer-link-btn footer-link-muted">+63 951 030 6070</span>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/jay-louis-bantugon-a86482283" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
