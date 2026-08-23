import { useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const DURATION_MS = 650
const TICK_MS = 45
const AUTO_CYCLE_MS = 4000

function randomChar() {
    return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

// Spaces and hyphens read oddly if they briefly scramble into a letter, so
// they lock in place immediately instead of joining the flicker.
function isFixedChar(char) {
    return char === ' ' || char === '-'
}

// Cycles through `words`: on hover, and every few seconds on its own, the
// current word scrambles into random characters and resolves into the next
// one left-to-right — each letter "locks in" in turn instead of the whole
// word snapping in at once.
export default function ScrambleText({ words, as: Tag = 'span', className }) {
    const [display, setDisplay] = useState(words[0])
    const indexRef = useRef(0)
    const frameRef = useRef(null)
    const intervalRef = useRef(null)

    const resolveTo = (text) => {
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
                        .map((char, i) => (isFixedChar(char) || i < lockedCount ? char : randomChar()))
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

    const advance = () => {
        indexRef.current = (indexRef.current + 1) % words.length
        resolveTo(words[indexRef.current])
    }

    useEffect(() => {
        intervalRef.current = setInterval(advance, AUTO_CYCLE_MS)
        return () => {
            clearInterval(intervalRef.current)
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        }
        // Runs once on mount — advance()/resolveTo() read indexRef.current and
        // the words prop fresh each call, so they don't need to be deps here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEnter = () => {
        // Hovering jumps to the next word right away; restart the interval so
        // the automatic cycle doesn't fire again a moment later.
        clearInterval(intervalRef.current)
        advance()
        intervalRef.current = setInterval(advance, AUTO_CYCLE_MS)
    }

    return (
        <Tag className={className} onMouseEnter={handleEnter}>
            {display}
        </Tag>
    )
}
