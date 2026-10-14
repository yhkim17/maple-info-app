import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 외부 접속 허용
    allowedHosts: true, // 모든 외부 호스트(ngrok 등) 접속 허용
    
    // 특정 도메인만 지정하고 싶다면 아래처럼 배열로 작성해도 됩니다:
    // allowedHosts: ['seminar-bristle-wanted.ngrok-free.dev']
  }
})
