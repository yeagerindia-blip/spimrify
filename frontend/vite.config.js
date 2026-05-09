import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Check karein aapka plugin ka naam yahi hai na?

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'spimrify.co.in',
      'www.spimrify.co.in'
    ]
  }
})