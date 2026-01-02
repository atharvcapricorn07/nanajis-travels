import { defineConfig } from 'vite'

export default defineConfig({
  base: '/nanajis-travels/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        destinations: 'destinations.html',
        about: 'about.html',
        kesaritours: 'kesaritours.html',
        learnmore: 'learnmore.html'
      }
    }
  }
})