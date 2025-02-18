import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 기본 경로 설정
  server: {
    historyApiFallback: true, // 새로고침 시 404 방지
  },
});
