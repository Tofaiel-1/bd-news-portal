import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// লোকাল ডেভেলপমেন্টেও Vercel Serverless Function (/api/live-news) হুবহু সিমুলেশন প্লাগইন
const vercelApiDevPlugin = () => ({
  name: 'vercel-api-dev',
  configureServer(server) {
    server.middlewares.use('/api/live-news', async (req, res) => {
      try {
        const handlerMod = await server.ssrLoadModule('./api/live-news.js');
        const handler = handlerMod.default;
        const mockRes = {
          setHeader: (k, v) => res.setHeader(k, v),
          end: (data) => res.end(data),
          status: (code) => {
            res.statusCode = code;
            return {
              json: (data) => {
                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                }
                res.end(JSON.stringify(data));
              },
              end: (data) => res.end(data)
            };
          }
        };
        await handler(req, mockRes);
      } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  server: {
    port: 5173,
    host: true,
    open: false,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  preview: {
    port: 4173,
    host: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('realMediaNewsData') || id.includes('data/newsData')) {
            return 'news-database';
          }
        }
      }
    }
  }
});
