import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load dotenv for additional configuration
  dotenv.config({ path: `.env.${mode}` })
  dotenv.config() // Load .env as fallback
  
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Expose API_BASE_URL to client code
      'import.meta.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || env.VITE_API_BASE_URL),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || env.API_BASE_URL),
    },
  }
})
