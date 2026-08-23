import { useEffect, useRef } from 'react'
import { SiTheodinproject, SiPalantir } from 'react-icons/si'
import { FaGraduationCap } from 'react-icons/fa6'
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
    },
    {
        Icon: FaGraduationCap,
        title: 'Harvard CS50x',
        tag: 'Bevezetés a Számítástudományba',
        description:
            'Elvégeztem a Harvard University informatikai alapkurzusát: algoritmusok, adatszerkezetek és memóriakezelés C-ben, majd Python, SQL és webfejlesztés — ez alapozta meg a rendszerszintű gondolkodásmódomat.',
    },
    {
        Icon: SiPalantir,
        title: 'Palantir Foundry',
        tag: 'Ipari adatplatform kurzus',
        description:
            'Elsajátítottam a Foundry adatintegrációs és ontológia-modellezési alapjait — ez adja a jelenlegi ipari (Industry 4.0) fejlesztői munkám technológiai hátterét a Lear Corporationnél.',
    },
]

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
                        {items.map(({ Icon, title, tag, description }) => (
                            <article className="learning-card" key={title}>
                                <Icon className="learning-card-icon" aria-hidden="true" />
                                <span className="learning-card-tag">{tag}</span>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
