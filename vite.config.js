
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// ⚠️ SSL para desenvolvimento (opcional)
let https = undefined

if (process.env.VITE_HTTPS === 'true') {
  try {
    const keyPath = path.resolve(__dirname, '.ssl/server.key')
    const certPath = path.resolve(__dirname, '.ssl/server.crt')
    
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      https = {
        key: fs.readFileSync(keyPath, 'utf8'),
        cert: fs.readFileSync(certPath, 'utf8'),
      }
      console.log('✅ HTTPS habilitado em desenvolvimento')
    }
  } catch (err) {
    console.warn('⚠️  SSL não encontrado. Rodando em HTTP.')
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    https,
    // Segurança: apenas localhost pode acessar
    allowedHosts: ['localhost', '127.0.0.1'],
  },
  build: {
    // Segurança: não exor source maps em produção
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  // Security: adicionar headers em tempo de dev
  preview: {
    port: 4173,
    https,
  },
})
