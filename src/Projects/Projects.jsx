import { useEffect, useRef, useState } from 'react'
import './Projects.css'

const projects = [
    {
        year: '2026',
        title: 'Sentym',
        description:
            'Tőzsdei sentiment elemző SaaS saját Raspberry Pi szerveren — Reddit és Twitter adatgyűjtés, FinBERT/RoBERTa ONNX modellek és React + Recharts dashboard.',
        tags: ['Python', 'FinBERT / RoBERTa (ONNX)', 'PostgreSQL', 'React', 'Recharts'],
        link: 'https://sentym.com',
    },
    {
        year: '2026',
        title: 'Fájl Jóváhagyó Szoftver',
        description:
            'Nyomdai Fájl jóváhagyó rendszer élő ügyféllel — B2B SaaS sablonná pozicionálva a nyomdai szektor számára.',
        tags: ['FastAPI', 'React', 'PostgreSQL', 'Docker', 'Brevo', 'PyMuPDF'],
        link: null,
    },
]

// Fades/slides a row in the first time it scrolls into view, then leaves it alone.
function ProjectRow({ project, index }) {
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
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <article className={`project-row${visible ? ' is-visible' : ''}`} ref={ref}>
            <span className="project-index">{String(index + 1).padStart(2, '0')}</span>

            <div className="project-main">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <ul className="project-tags">
                    {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
                <span className="project-year">{project.year}</span>
            </div>

            {project.link ? (
                <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                    Projekt megtekintése <span aria-hidden="true">&rarr;</span>
                </a>
            ) : (
                <span className="project-link project-link--static">Élő ügyfélprojekt</span>
            )}
        </article>
    )
}

export default function Projects() {
    return (
        <section className="projects" id="projektek">
            <div className="projects-intro">
                <h2 className="projects-heading">
                    Saját<span>Projektek</span>
                </h2>
                <p>Néhány dolog, amit mostanában építettem — az ötlettől az éles üzembe helyezésig.</p>
            </div>

            <div className="projects-list">
                {projects.map((project, i) => (
                    <ProjectRow key={project.title} project={project} index={i} />
                ))}
            </div>
        </section>
    )
}
