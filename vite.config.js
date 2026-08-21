import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served as a GitHub Pages project site (https://mszrsbotond.github.io/portfolio_website/),
  // not from a custom domain (the old CNAME was removed) — asset URLs need this
  // prefix or they'd resolve against the domain root and 404.
  base: '/portfolio_website/',
})
