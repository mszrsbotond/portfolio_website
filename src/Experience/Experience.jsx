import { useEffect, useRef, useState } from 'react'
import './Experience.css'

// Grouped into rows rather than one entry per row: "Most" holds two cards side
// by side at the same height (day job on the left, freelance work on the
// right), while every other point in time gets its own single-card row.
const rows = [
    [
        {
            side: 'left',
            year: 'Most',
            title: 'Szoftverfejlesztő Gyakornok',
            subtitle: 'Lear Corporation, Gödöllő',
            description:
                'Ipari (Industry 4.0) szoftverrendszereken dolgozom Palantir Foundry alapokon — adatmodellezéstől a felhasználói felületekig, amelyek átláthatóbbá teszik a gyártási folyamatokat.',
        },
        {
            side: 'right',
            year: 'Most',
            title: 'Vállalkozó Fejlesztő',
            subtitle: 'Egyéni vállalkozás',
            description:
                'Emellett vállalkozóként is dolgozom: ügyfeleimnek egyedi projekteket, webalkalmazásokat és weboldalakat tervezek és fejlesztek, az első ötlettől a kész, éles termékig.',
        },
    ],
    [
        {
            side: 'right',
            year: '2025',
            title: 'Mérnökinformatika BSc',
            subtitle: 'Óbudai Egyetem',
            description:
                'Szoftverfejlesztési és mérnöki alapok elsajátítása az egyetemen, emellett önállóan tanult full-stack fejlesztőként dolgozom saját és ügyfélprojekteken.',
        },
    ],
    [
        {
            side: 'left',
            year: 'Korábban',
            title: 'Programozás Tanulása',
            subtitle: 'Önálló tanulás — The Odin Project, CS50, Cloudflare kurzus',
            description:
                'Az egyetem előtt önállóan sajátítottam el a szoftverfejlesztés alapjait: végigvittem a The Odin Project és a Harvard CS50 kurzusát, valamint egy Cloudflare kurzust, és mindezt saját projekteken, köztük egy otthoni Raspberry Pi szerveren is gyakoroltam.',
        },
    ],
]

// Flat list matching render order, so cardRefs/revealed indices line up with
// what's actually on screen regardless of how many cards share a row.
const flatCards = rows.flat()

// Stays hidden until the traveling dot reaches it, then fades/slides in smoothly.
function TimelineCard({ entry, visible, cardRef }) {
    return (
        <div className={`experience-card card-${entry.side}${visible ? ' is-visible' : ''}`} ref={cardRef}>
            <span className="card-year">{entry.year}</span>
            <h3>{entry.title}</h3>
            <span className="card-subtitle">{entry.subtitle}</span>
            <p>{entry.description}</p>
        </div>
    )
}

export default function Experience() {
    const lineRef = useRef(null)
    const dotRef = useRef(null)
    const cardRefs = useRef([])
    const displayedProgressRef = useRef(0)
    const [revealed, setRevealed] = useState(() => flatCards.map(() => false))

    useEffect(() => {
        let rafId = null

        // Runs every animation frame while the dot hasn't caught up yet: eases the
        // displayed position a fraction of the way toward the scroll-derived target
        // instead of snapping straight to it, so the dot glides rather than ticking
        // in lockstep with (often bursty) scroll events.
        const applyFrame = () => {
            rafId = null
            const line = lineRef.current
            const dot = dotRef.current
            if (!line || !dot) return

            const lineRect = line.getBoundingClientRect()

            // Keep the dot's travel clear of the true bottom edge of the viewport: it
            // starts a little later and finishes well short of that edge, instead of
            // riding all the way down to it.
            const bottomBuffer = window.innerHeight * 0.18
            const raw = (window.innerHeight - bottomBuffer - lineRect.top) / lineRect.height
            const target = Math.min(1, Math.max(0, raw))

            const current = displayedProgressRef.current
            const eased = current + (target - current) * 0.12
            const settled = Math.abs(target - eased) < 0.0008
            displayedProgressRef.current = settled ? target : eased

            dot.style.top = `${displayedProgressRef.current * 100}%`

            // Where the dot currently sits, in the same viewport coordinates as the cards.
            const dotY = lineRect.top + displayedProgressRef.current * lineRect.height

            setRevealed((prev) => {
                let changed = false
                const next = prev.map((wasVisible, i) => {
                    const card = cardRefs.current[i]
                    if (!card) return wasVisible
                    const cardRect = card.getBoundingClientRect()
                    const isVisible = dotY >= cardRect.top + cardRect.height * 0.15
                    if (isVisible !== wasVisible) changed = true
                    return isVisible
                })
                return changed ? next : prev
            })

            if (!settled) {
                rafId = requestAnimationFrame(applyFrame)
            }
        }

        const requestFrame = () => {
            if (rafId === null) rafId = requestAnimationFrame(applyFrame)
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
        <section className="experience" id="szakmai-hatter">
            <h2 className="experience-heading">
                Szakmai
                <span>Háttér</span>
            </h2>

            <div className="experience-track">
                <div className="experience-line" ref={lineRef}>
                    <div className="experience-dot" ref={dotRef} />
                </div>

                {rows.map((rowCards, ri) => {
                    // Running offset into the flat card list so refs/visibility line
                    // up with flatCards regardless of how many cards this row holds.
                    const rowStart = rows.slice(0, ri).reduce((n, r) => n + r.length, 0)
                    return (
                        <div className="experience-row" key={rowCards.map((c) => c.title).join('+')}>
                            {rowCards.map((entry, ci) => {
                                const i = rowStart + ci
                                return (
                                    <TimelineCard
                                        key={entry.title}
                                        entry={entry}
                                        visible={revealed[i]}
                                        cardRef={(el) => {
                                            cardRefs.current[i] = el
                                        }}
                                    />
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
