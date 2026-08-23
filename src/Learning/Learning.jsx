import { useEffect, useRef, useState } from 'react'
import { SiTheodinproject, SiPalantir } from 'react-icons/si'
import { FaGraduationCap } from 'react-icons/fa6'
import topImg from '../assets/TOP.jpg'
import cs50Img from '../assets/cs50.jpg'
import palantirImg from '../assets/PalantirFoundry.jpg'
import './Learning.css'

const DESKTOP_BREAKPOINT = 760

// No official CS50/Harvard mark in the icon packs (trademark reasons, same
// story as the couple of TechStack icons that fall back to a concept icon
// instead of the real logo) — a graduation cap stands in for it instead.
const items = [
    {
        Icon: SiTheodinproject,
        title: 'The Odin Project',
        tag: 'Önálló tanulás — Full-Stack Webfejlesztés',
        description:
            'Végigvittem a teljes full-stack tananyagot: HTML, CSS és JavaScript alapoktól Node.js-en és adatbázisokon át valódi, önállóan megírt projektekig — gyakorlat-központú, projekt-alapú tanulás.',
        image: topImg,
    },
    {
        Icon: FaGraduationCap,
        title: 'Harvard CS50x',
        tag: 'Bevezetés a Számítástudományba',
        description:
            'Elvégeztem a Harvard University informatikai alapkurzusát: algoritmusok, adatszerkezetek és memóriakezelés C-ben, majd Python, SQL és webfejlesztés — ez alapozta meg a rendszerszintű gondolkodásmódomat.',
        image: cs50Img,
    },
    {
        Icon: SiPalantir,
        title: 'Palantir Foundry',
        tag: 'Ipari adatplatform kurzus',
        description:
            'Elsajátítottam a Foundry adatintegrációs és ontológia-modellezési alapjait — ez adja a jelenlegi ipari (Industry 4.0) fejlesztői munkám technológiai hátterét a Lear Corporationnél.',
        image: palantirImg,
    },
]

// A card counts as "arrived" once it's scrolled far enough left into the
// pinned viewport — past this fraction of the viewport width, counting from
// the right edge it slides in from. Recomputed live off the same scroll
// progress as the track's transform, so scrolling back up un-reveals a card
// again, same as the Experience timeline's dot-driven reveal.
const REVEAL_FRACTION = 0.72

// Desktop: the wrapper is items.length viewport-heights tall, its inner
// .learning-sticky stays pinned (position: sticky) while that scrolls past,
// and the card track's horizontal position is driven directly off how far
// through that pinned range the page has scrolled — vertical scroll input,
// horizontal visual motion. Below the breakpoint that's dropped entirely in
// favor of a plain swipeable row (see Learning.css); pinning a 300vh section
// on mobile fights viewport-height quirks (address bar show/hide) for no
// real benefit over a normal horizontal scroller.
export default function Learning() {
    const wrapRef = useRef(null)
    const trackRef = useRef(null)
    const cardRefs = useRef([])
    const [revealed, setRevealed] = useState(() => items.map(() => false))

    useEffect(() => {
        const wrap = wrapRef.current
        const track = trackRef.current
        if (!wrap || !track) return

        let rafId = null

        const apply = () => {
            rafId = null

            if (window.innerWidth <= DESKTOP_BREAKPOINT) {
                track.style.transform = ''
                return
            }

            const rect = wrap.getBoundingClientRect()
            const scrollable = rect.height - window.innerHeight
            if (scrollable <= 0) return

            const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
            const maxTranslate = Math.max(0, track.scrollWidth - track.clientWidth)
            track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`

            // Reading geometry back right after writing the transform forces a
            // reflow, but there are only a handful of cards — a non-issue.
            setRevealed((prev) => {
                let changed = false
                const next = prev.map((wasRevealed, i) => {
                    const card = cardRefs.current[i]
                    if (!card) return wasRevealed
                    const isRevealed = card.getBoundingClientRect().left < window.innerWidth * REVEAL_FRACTION
                    if (isRevealed !== wasRevealed) changed = true
                    return isRevealed
                })
                return changed ? next : prev
            })
        }

        const requestFrame = () => {
            if (rafId === null) rafId = requestAnimationFrame(apply)
        }

        requestFrame()
        window.addEventListener('scroll', requestFrame, { passive: true })
        window.addEventListener('resize', requestFrame)
        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId)
            window.removeEventListener('scroll', requestFrame)
            window.removeEventListener('resize', requestFrame)
        }
    }, [])

    return (
        <section className="learning" id="tanultam">
            <div className="learning-pin-wrap" ref={wrapRef} style={{ '--item-count': items.length }}>
                <div className="learning-sticky">
                    <div className="learning-intro">
                        <h2 className="learning-heading">
                            Amit<span>Tanultam</span>
                        </h2>
                        <p>Kurzusok és tananyagok, amik a mai tudásom alapjait adják.</p>
                    </div>

                    <div className="learning-track" ref={trackRef}>
                        {items.map(({ Icon, title, tag, description, image }, i) => (
                            <article
                                className={`learning-card${revealed[i] ? ' is-visible' : ''}`}
                                key={title}
                                ref={(el) => {
                                    cardRefs.current[i] = el
                                }}
                            >
                                <header className="learning-card-header">
                                    <Icon className="learning-card-logo" aria-hidden="true" />
                                    <div className="learning-card-heading">
                                        <span className="learning-card-tag">{tag}</span>
                                        <h3>{title}</h3>
                                    </div>
                                </header>

                                <div className="learning-card-media">
                                    <img className="learning-card-media-img" src={image} alt={title} />
                                </div>

                                <p className="learning-card-description">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
