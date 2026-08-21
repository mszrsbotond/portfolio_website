import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Cursor from './Cursor/Cursor'
import Header from './Header/Header'
import HomePage from './HomePage/HomePage'
import WhatIDo from './WhatIDo/WhatIDo'
import TechStack from './TechStack/TechStack'
import Projects from './Projects/Projects'
import Experience from './Experience/Experience'
import Footer from './Footer/Footer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cursor/>
    <Header/>
    <HomePage/>
    <WhatIDo/>
    <TechStack/>
    <Projects/>
    <Experience/>
    <Footer/>
  </StrictMode>,
)
