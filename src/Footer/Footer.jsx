import { FaEnvelope, FaLinkedin } from 'react-icons/fa6'
import './Footer.css'

// Same anchors as the header nav (see Header/Header.jsx) so the footer works
// as a second, always-reachable way to jump around the page.
const FOOTER_NAV = [
    { href: '#mivel-foglalkozom', label: 'Mivel Foglalkozom' },
    { href: '#technologia', label: 'Technológiai Stack' },
    { href: '#projektek', label: 'Projektek' },
    { href: '#szakmai-hatter', label: 'Szakmai Háttér' },
]

const LINKEDIN_URL = 'https://www.linkedin.com/in/botond-m%C3%A9sz%C3%A1ros-900166350/'
const EMAIL = 'dev@meszarosbotond.hu'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <a className="footer-brand-name" href="#top">
                        Mészáros Botond
                    </a>
                    <p className="footer-tagline">
                        Szoftverfejlesztő és vállalkozó — projekteket, webalkalmazásokat és weboldalakat
                        készítek ügyfeleknek, az ötlettől a kész, éles termékig.
                    </p>
                </div>

                <nav className="footer-nav" aria-label="Oldal navigáció">
                    {FOOTER_NAV.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="footer-contact">
                    <a href={`mailto:${EMAIL}`}>
                        <FaEnvelope aria-hidden="true" /> {EMAIL}
                    </a>
                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                        <FaLinkedin aria-hidden="true" /> LinkedIn
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    &copy; {year} Mészáros Botond. A weboldal tartalma és felépítése az én tulajdonom,
                    minden jog fenntartva.
                </p>
                <a className="footer-top-link" href="#top">
                    Vissza a tetejére <span aria-hidden="true">↑</span>
                </a>
            </div>
        </footer>
    )
}
