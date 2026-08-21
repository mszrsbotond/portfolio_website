import { useEffect, useRef } from 'react'
import './Cursor.css'

const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label'
const PARTICLE_COUNT = 26
const BURST_MS = 320

// Precomputed once at module load — an uneven ring of dots (radius and size
// both jittered) so the burst reads as a scattered scorch mark rather than a
// perfect circle of dots, like the reference image.
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.35 - 0.175)
    const radius = 22 + Math.random() * 26
    const size = 2 + Math.random() * 3.5
    const delay = Math.random() * 0.05
    return {
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius,
        // Small extra jitter offset the shake phase bounces between.
        jx: Math.random() * 10 - 5,
        jy: Math.random() * 10 - 5,
        size,
        delay,
    }
})

export default function Cursor() {
    const rootRef = useRef(null)
    const dotRef = useRef(null)
    const ringRef = useRef(null)
    const particlesRef = useRef(null)

    useEffect(() => {
        // There's no hovering cursor to replace on touch/coarse-pointer devices —
        // skip the whole effect and leave the native cursor alone there.
        if (!window.matchMedia('(pointer: fine)').matches) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        const dot = { ...target }
        const ring = { ...target }

        document.body.classList.add('custom-cursor-active')

        let rafId = null
        let visible = false
        let burstTimeoutId = null

        const apply = (el, pos) => {
            if (el) el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
        }
        apply(dotRef.current, dot)
        apply(ringRef.current, ring)

        const tick = () => {
            rafId = null

            // The dot eases in fast (nearly 1:1 with the pointer); the ring eases in
            // slowly, so it visibly lags behind on quick moves and drifts back under
            // the dot once the cursor settles. Reduced-motion users get both glued
            // straight to the pointer instead of the trailing effect.
            const dotEase = reduceMotion ? 1 : 0.35
            const ringEase = reduceMotion ? 1 : 0.1

            dot.x += (target.x - dot.x) * dotEase
            dot.y += (target.y - dot.y) * dotEase
            ring.x += (target.x - ring.x) * ringEase
            ring.y += (target.y - ring.y) * ringEase

            apply(dotRef.current, dot)
            apply(ringRef.current, ring)
            if (particlesRef.current) apply(particlesRef.current, ring)

            const settled =
                Math.abs(target.x - dot.x) < 0.1 &&
                Math.abs(target.y - dot.y) < 0.1 &&
                Math.abs(target.x - ring.x) < 0.1 &&
                Math.abs(target.y - ring.y) < 0.1

            if (!settled) rafId = requestAnimationFrame(tick)
        }

        const requestFrame = () => {
            if (rafId === null) rafId = requestAnimationFrame(tick)
        }

        const onMove = (e) => {
            target.x = e.clientX
            target.y = e.clientY
            if (!visible) {
                visible = true
                dot.x = target.x
                dot.y = target.y
                ring.x = target.x
                ring.y = target.y
                apply(dotRef.current, dot)
                apply(ringRef.current, ring)
                if (particlesRef.current) apply(particlesRef.current, ring)
                document.body.classList.add('custom-cursor-visible')
            }
            requestFrame()
        }

        const onLeave = () => {
            visible = false
            document.body.classList.remove('custom-cursor-visible')
        }

        // A one-shot burst, not a sustained hover style: on every fresh hover-enter
        // the dots scatter outward, shake in place, then collapse back and fade —
        // ~0.3s total — and the cursor settles back to its resting shape even if
        // the pointer is still sitting over the element.
        const triggerBurst = () => {
            if (reduceMotion) return

            if (burstTimeoutId !== null) clearTimeout(burstTimeoutId)

            const particlesEl = particlesRef.current
            if (particlesEl) {
                // Force a reflow between removing and re-adding the class so the
                // browser actually restarts the CSS animation instead of no-op'ing
                // a class that (from its point of view) was never really removed.
                particlesEl.classList.remove('is-bursting')
                void particlesEl.offsetWidth
                particlesEl.classList.add('is-bursting')
            }
            rootRef.current?.classList.add('is-bursting')

            burstTimeoutId = setTimeout(() => {
                rootRef.current?.classList.remove('is-bursting')
                burstTimeoutId = null
            }, BURST_MS)
        }

        const onOver = (e) => {
            if (e.target.closest?.(HOVER_SELECTOR)) triggerBurst()
        }

        window.addEventListener('mousemove', onMove)
        document.addEventListener('mouseleave', onLeave)
        document.addEventListener('mouseover', onOver)

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId)
            if (burstTimeoutId !== null) clearTimeout(burstTimeoutId)
            window.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseleave', onLeave)
            document.removeEventListener('mouseover', onOver)
            document.body.classList.remove('custom-cursor-active', 'custom-cursor-visible')
        }
    }, [])

    return (
        <div className="custom-cursor" ref={rootRef} aria-hidden="true">
            <div className="cursor-ring" ref={ringRef} />
            <div className="cursor-dot" ref={dotRef} />
            <div className="cursor-particles" ref={particlesRef}>
                {particles.map((p, i) => (
                    <span
                        key={i}
                        className="cursor-particle"
                        style={{
                            '--dx': `${p.dx}px`,
                            '--dy': `${p.dy}px`,
                            '--jx': `${p.jx}px`,
                            '--jy': `${p.jy}px`,
                            '--size': `${p.size}px`,
                            '--delay': `${p.delay}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
