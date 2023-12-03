import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
    },
  },
  server: {
    proxy: {
      // 配置反向代理  
      '/api/user': {
        target: 'http://127.0.0.1:3002', // 目标服务器的地址  
        changeOrigin: true, // 开启代理服务器，将请求转发到目标服务器上  
        //rewrite: (path) => path.replace(/^\/api/, '') // 路径重写，去掉开头的 /api  
      },
      '/api/main': {
        target: 'http://127.0.0.1:3000', // 目标服务器的地址  
        changeOrigin: true, // 开启代理服务器，将请求转发到目标服务器上  
        //rewrite: (path) => path.replace(/^\/api/, '') // 路径重写，去掉开头的 /api  
      }
    }
  }
})
