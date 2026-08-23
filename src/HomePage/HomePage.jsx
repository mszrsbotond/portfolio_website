import { useEffect, useRef } from 'react'
import { FaLinkedin } from 'react-icons/fa6'
import './HomePage.css'
import ScrambleText from './ScrambleText'
import ParticleField from './ParticleField'
import profilePic from '../assets/profile_pic.jpeg'
import cvPdf from '../assets/Meszaros_Botond_Magyar_CV.pdf'

const NAME = 'Mészáros Botond'
const NAME_WORDS = NAME.split(' ')
const DESKTOP_BREAKPOINT = 760
const LINKEDIN_URL = 'https://www.linkedin.com/in/botond-m%C3%A9sz%C3%A1ros-900166350/'

// What ScrambleText cycles through under the name — on hover, and every few
// seconds on its own (see ScrambleText.jsx).
const TITLE_WORDS = [
    'Szoftverfejlesztő',
    'Full-Stack Fejlesztő',
    'Szoftvermérnök',
    'Backend Fejlesztő',
    'Mérnökinformatikus Hallgató',
    'Fejlesztő',
    'Webfejlesztő',
]

export default function HomePage(){
    // Flat left-to-right index across the whole name (spaces excluded) drives the
    // per-letter animation-delay, so the reveal reads as one continuous sweep even
    // though the words are split into separate flex groups below.
    let letterIndex = 0

    const titleMainRef = useRef(null)
    const lastWordRef = useRef(null)
    const titleBottomRef = useRef(null)

    useEffect(() => {
        const heading = titleMainRef.current
        const lastWord = lastWordRef.current
        const subtitle = titleBottomRef.current
        if (!heading || !lastWord || !subtitle) return

        // The heading's own box spans the full flex column (it's stretched by
        // the parent), but its glyphs — being left-aligned — end well short of
        // that box's right edge. So the box's own width is useless here; what
        // we actually want is (last word's right edge) − (heading's left edge),
        // i.e. the true rendered span of the text. Pin the subtitle block's
        // width to that so right-aligning its lines lands them flush with
        // where the name ends. Re-synced on any reflow: window resize, the
        // cqw-based font-size clamp, or the webfont swapping in. Below the
        // mobile breakpoint the layout centers everything instead, so the
        // constraint is dropped there.
        const sync = () => {
            if (window.innerWidth <= DESKTOP_BREAKPOINT) {
                subtitle.style.width = ''
                return
            }
            const left = heading.getBoundingClientRect().left
            const right = lastWord.getBoundingClientRect().right
            subtitle.style.width = `${right - left}px`
        }
        sync()

        const observer = new ResizeObserver(sync)
        observer.observe(heading)
        observer.observe(lastWord)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="title" id="top">
            <ParticleField />
            <img className="profile-pic" src={profilePic} alt="Meszaros Botond" />
            <div className="title-text">
                <h1 className="title-main" ref={titleMainRef}>
                    {NAME_WORDS.map((word, wi) => (
                        <span
                            className="name-word"
                            key={wi}
                            ref={wi === NAME_WORDS.length - 1 ? lastWordRef : undefined}
                        >
                            {word.split('').map((letter, li) => (
                                <span className="name-letter" style={{ '--i': letterIndex++ }} key={li}>
                                    {letter}
                                </span>
                            ))}
                        </span>
                    ))}
                </h1>
                <div className="title-bottom" ref={titleBottomRef}>
                    <ScrambleText words={TITLE_WORDS} />
                    <a className="cv-button" href={cvPdf} download="Meszaros_Botond_Oneletrajz.pdf">
                        Önéletrajz <span aria-hidden="true">↓</span>
                    </a>
                    <a className="cv-button" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                        <FaLinkedin aria-hidden="true" /> LinkedIn
                    </a>
                </div>
            </div>
        </div>
    )
}
