import { useEffect, useRef, useState } from 'react'
import {
    SiJavascript,
    SiTypescript,
    SiHtml5,
    SiCss,
    SiReact,
    SiFastapi,
    SiPython,
    SiDotnet,
    SiPostgresql,
    SiMysql,
    SiRedis,
    SiHuggingface,
    SiOnnx,
    SiPandas,
    SiDocker,
    SiGit,
    SiPalantir,
    SiRaspberrypi,
    SiN8N,
    SiLinux,
    SiGnubash,
    SiFigma,
    SiDiagramsdotnet,
} from 'react-icons/si'
// Not every brand has an SVG mark in the icon packs (trademark reasons, mostly) —
// these four fall back to a plain concept icon instead of the real logo.
import { FaChartLine, FaDatabase, FaPalette, FaImage } from 'react-icons/fa6'
import './TechStack.css'

const stack = [
    {
        category: 'Frontend',
        items: [
            { name: 'JavaScript', Icon: SiJavascript },
            { name: 'TypeScript', Icon: SiTypescript },
            { name: 'HTML', Icon: SiHtml5 },
            { name: 'CSS', Icon: SiCss },
            { name: 'React', Icon: SiReact },
            { name: 'Recharts', Icon: FaChartLine },
        ],
    },
    {
        category: 'Backend',
        items: [
            { name: 'FastAPI', Icon: SiFastapi },
            { name: 'Python', Icon: SiPython },
            { name: 'C# / .NET', Icon: SiDotnet },
        ],
    },
    {
        category: 'Adatbázis',
        items: [
            { name: 'PostgreSQL', Icon: SiPostgresql },
            { name: 'MySQL', Icon: SiMysql },
            { name: 'Oracle SQL', Icon: FaDatabase },
            { name: 'Redis', Icon: SiRedis },
        ],
    },
    {
        category: 'AI & Gépi Tanulás',
        items: [
            { name: 'Hugging Face (FinBERT / RoBERTa)', Icon: SiHuggingface },
            { name: 'ONNX Runtime', Icon: SiOnnx },
            { name: 'Pandas', Icon: SiPandas },
        ],
    },
    {
        category: 'DevOps & Eszközök',
        items: [
            { name: 'Docker', Icon: SiDocker },
            { name: 'Git', Icon: SiGit },
            { name: 'Palantir Foundry', Icon: SiPalantir },
            { name: 'Raspberry Pi', Icon: SiRaspberrypi },
            { name: 'n8n', Icon: SiN8N },
            { name: 'Linux', Icon: SiLinux },
            { name: 'Bash', Icon: SiGnubash },
        ],
    },
    {
        category: 'Design & Tervezés',
        items: [
            { name: 'Figma', Icon: SiFigma },
            { name: 'Canva', Icon: FaPalette },
            { name: 'Photoshop', Icon: FaImage },
            { name: 'draw.io', Icon: SiDiagramsdotnet },
        ],
    },
]

const STAGGER_MS = 70

// Reveals a category's icons left-to-right the first time it scrolls into view.
// Flex-wrap keeps DOM order == reading order, so an index-based transition-delay
// alone produces the "row by row" cascade — no per-row bookkeeping needed.
function StackCategory({ category, items }) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div className={`stack-category${visible ? ' is-visible' : ''}`} ref={ref}>
            <h3 className="stack-category-label">{category}</h3>
            <ul className="stack-items">
                {items.map(({ name, Icon }, i) => (
                    <li
                        key={name}
                        className="stack-item"
                        style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
                    >
                        <Icon className="stack-item-icon" aria-hidden="true" />
                        <span>{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function TechStack() {
    return (
        <section className="tech-stack" id="technologia">
            <div className="stack-intro">
                <h2 className="stack-heading">
                    Technológiai<span>Stack</span>
                </h2>
                <p>
                    Azok a technológiák, amelyeket modern, megbízható és skálázható alkalmazások tervezéséhez,
                    fejlesztéséhez és üzemeltetéséhez használok.
                </p>
            </div>

            <div className="stack-list">
                {stack.map(({ category, items }) => (
                    <StackCategory key={category} category={category} items={items} />
                ))}
            </div>
        </section>
    )
}
