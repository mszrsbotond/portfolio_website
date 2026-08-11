import { useEffect, useRef } from 'react'
import './ParticleField.css'

const INK = '89, 33, 31' // matches the site's ink color, used as an rgba() base below
const MAX_PARTICLES = 60
const AREA_PER_PARTICLE = 18000 // px² per particle — density scales with the hero's size
const MIN_PARTICLES = 14
const LINK_DISTANCE = 130
const MOUSE_RADIUS = 110
const MOUSE_FORCE = 0.9
const DRIFT_SPEED = 0.18

function createParticles(width, height) {
    const count = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round((width * height) / AREA_PER_PARTICLE)))
    return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
    }))
}

// A quiet constellation of dots drifting behind the hero content: nearby dots
// link up with a thin line, and anything within reach of the pointer gets
// nudged away — decorative, but invites a bit of poking around.
export default function ParticleField() {
    const canvasRef = useRef(null)

    useEffect(() => {
        // A field that's always subtly in motion is exactly the kind of thing
        // prefers-reduced-motion exists to opt out of — skip it entirely rather
        // than offering a static version nobody asked for.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const canvas = canvasRef.current
        const container = canvas?.parentElement
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')

        let width = 0
        let height = 0
        let particles = []
        // Starts far off-canvas so nothing is "repelled" before the pointer
        // ever actually moves over the hero (and stays there for touch devices,
        // where it never will — the field just drifts on its own there).
        const mouse = { x: -9999, y: -9999 }

        const resize = () => {
            const rect = container.getBoundingClientRect()
            width = rect.width
            height = rect.height
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            particles = createParticles(width, height)
        }

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
        const onLeave = () => {
            mouse.x = -9999
            mouse.y = -9999
        }

        let rafId
        const step = () => {
            ctx.clearRect(0, 0, width, height)

            for (const p of particles) {
                // Gentle constant drift — velocity itself is never touched by the
                // pointer repulsion below, so a particle always settles back to
                // its same quiet wander once it's out of reach again.
                p.x += p.vx
                p.y += p.vy

                const dx = p.x - mouse.x
                const dy = p.y - mouse.y
                const dist = Math.hypot(dx, dy)
                if (dist < MOUSE_RADIUS && dist > 0.001) {
                    const push = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE
                    p.x += (dx / dist) * push * 6
                    p.y += (dy / dist) * push * 6
                }

                // Wrap at the edges instead of bouncing, so density stays even.
                if (p.x < -10) p.x = width + 10
                else if (p.x > width + 10) p.x = -10
                if (p.y < -10) p.y = height + 10
                else if (p.y > height + 10) p.y = -10
            }

            // Links drawn under the dots — thin, and fainter the further apart
            // the pair is, so the network reads as a soft web rather than a grid.
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i]
                    const b = particles[j]
                    const dist = Math.hypot(a.x - b.x, a.y - b.y)
                    if (dist < LINK_DISTANCE) {
                        ctx.strokeStyle = `rgba(${INK}, ${0.16 * (1 - dist / LINK_DISTANCE)})`
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }

            ctx.fillStyle = `rgba(${INK}, 0.45)`
            for (const p of particles) {
                ctx.beginPath()
                ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
                ctx.fill()
            }

            rafId = requestAnimationFrame(step)
        }

        resize()
        rafId = requestAnimationFrame(step)

        const observer = new ResizeObserver(resize)
        observer.observe(container)
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseleave', onLeave)

        return () => {
            cancelAnimationFrame(rafId)
            observer.disconnect()
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseleave', onLeave)
        }
    }, [])

    return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />
}
