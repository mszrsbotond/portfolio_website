import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DURATION_MS = 650
const TICK_MS = 45

function randomChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

// On hover, the text scrambles into random characters and resolves back to
// the real word left-to-right — each letter "locks in" in turn instead of
// the whole word snapping back at once.
export default function ScrambleText({ text, as: Tag = 'span', className }) {
    const [display, setDisplay] = useState(text)
    const frameRef = useRef(null)

    // Bail out mid-animation on unmount so it doesn't keep ticking after the
    // element (and its setState) are gone.
    useEffect(() => {
        return () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        }
    }, [])

    const handleEnter = () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

        const start = performance.now()
        let lastTick = 0

        const step = (now) => {
            const elapsed = now - start
            const progress = Math.min(1, elapsed / DURATION_MS)
            // How many characters, counting from the left, have already landed
            // on their real value — this is what makes the resolve sweep
            // left-to-right instead of the whole word settling together.
            const lockedCount = Math.floor(progress * text.length)

            // Throttle the random re-rolls independently of the lock sweep so
            // the flicker stays readable instead of updating every frame.
            if (now - lastTick > TICK_MS || progress >= 1) {
                lastTick = now
                setDisplay(
                    text
                        .split('')
                        .map((char, i) => (char === ' ' || i < lockedCount ? char : randomChar()))
                        .join('')
                )
            }

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(step)
            } else {
                setDisplay(text)
                frameRef.current = null
            }
        }

        frameRef.current = requestAnimationFrame(step)
    }

    return (
        <Tag className={className} onMouseEnter={handleEnter}>
            {display}
        </Tag>
    )
}
