import './Header.css'

// Order matches the page's actual scroll order (see main.jsx), not the order
// they were requested in — clicking down the list should track scrolling
// down the page, otherwise the nav fights the thing it's meant to help with.
const NAV_ITEMS = [
    { href: '#mivel-foglalkozom', label: 'Mivel Foglalkozom' },
    { href: '#technologia', label: 'Technológiai Stack' },
    { href: '#projektek', label: 'Projektek' },
    { href: '#szakmai-hatter', label: 'Szakmai Háttér' },
    { href: '#tanultam', label: 'Amit Tanultam' },
]

export default function Header() {
    return (
        <header className="site-header">
            <a className="site-header-brand" href="#top">
                MB
            </a>
            <nav className="site-header-nav">
                {NAV_ITEMS.map((item) => (
                    <a key={item.href} href={item.href}>
                        {item.label}
                    </a>
                ))}
            </nav>
        </header>
    )
}
