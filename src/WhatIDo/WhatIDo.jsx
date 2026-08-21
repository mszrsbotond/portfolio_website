import './WhatIDo.css'

// Framed around what the client gets, not which tools I used to build it —
// the concrete tech names live in the TechStack section instead.
const services = [
    {
        title: 'Full-Stack Webfejlesztés',
        description:
            'Ötlettől a kész, éles rendszerig kísérem végig a projektet: gyors, megbízható és könnyen bővíthető webalkalmazásokat építek, amiket nem kell fél év múlva újraírni.',
        items: [
            'Teljes körű fejlesztés a tervezéstől az üzemeltetésig',
            'Gyors, stabil működés nagyobb terhelés alatt is',
            'Automatizált e-mailek, fizetések és értesítések',
        ],
    },
    {
        title: 'Ipari Szoftverfejlesztés',
        description:
            'Gyártó- és iparvállalatoknak segítek átláthatóbbá és gyorsabbá tenni a napi működésüket — valós idejű adatok, könnyen kezelhető felületek és jobb döntések a gyártásban.',
        items: [
            'Valós idejű gyártási adatok egy helyen',
            'Áttekinthető irányítópultok a napi munkához',
            'Vállalati rendszerek összekapcsolása',
        ],
    },
    {
        title: 'Automatizálás & Adatelemzés',
        description:
            'Kevesebb manuális munka, több rálátás: automatizálom az ismétlődő feladatokat, és olyan eszközöket építek, amelyek adatok alapján segítenek jobb döntést hozni.',
        items: [
            'Ismétlődő folyamatok automatizálása',
            'Adatgyűjtés és -elemzés üzleti döntésekhez',
            'Egyedi riportok és irányítópultok',
        ],
    },
]

export default function WhatIDo() {
    return (
        <section className="what-i-do" id="mivel-foglalkozom">
            <div className="wid-intro">
                <h2 className="wid-heading">
                    Mivel<span>Foglalkozom</span>
                </h2>
            </div>

            {/* Each item is sticky with its own top offset, so as you scroll, its title
                locks in place under the ones before it while the next item's opaque
                panel rises up and takes over the description/list beneath — no JS
                required, it's all native scroll + position: sticky. */}
            <div className="wid-stack">
                {services.map((service, i) => (
                    <div className="wid-item" key={service.title} style={{ '--i': i, zIndex: i + 1 }}>
                        <h3 className="wid-item-title">{service.title}</h3>
                        <div className="wid-item-body">
                            <p>{service.description}</p>
                            <ol className="wid-item-list">
                                {service.items.map((item, idx) => (
                                    <li key={item}>
                                        <span className="wid-item-index">{String(idx + 1).padStart(2, '0')}</span>
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
