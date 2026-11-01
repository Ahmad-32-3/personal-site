import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from "vite"
import type { IncomingMessage, ServerResponse } from "http"

const WORK_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".map": "application/json",
}

const STATIC_PREFIXES = ["/work/", "/ocr-walkthrough/", "/ocr-demo/"]

function workIndexes(): Plugin {
  const serve = (root: string) => {
    return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const url = decodeURIComponent((req.url ?? "").split("?")[0])
      const prefix = STATIC_PREFIXES.find((p) => url === p.slice(0, -1) || url.startsWith(p))
      if (!prefix) return next()
      const bound = path.join(root, "public", prefix.replace(/^\/+|\/$/g, "").split("/")[0])
      let file = path.join(root, "public", url.replace(/^\/+/, ""))
      if (url.endsWith("/") || (fs.existsSync(file) && fs.statSync(file).isDirectory())) {
        file = path.join(file, "index.html")
      }
      if (!file.startsWith(bound) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        return next()
      }
      res.setHeader("Content-Type", WORK_TYPES[path.extname(file)] ?? "application/octet-stream")
      fs.createReadStream(file).pipe(res)
    }
  }
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(serve(server.config.root))
  }
  return {
    name: "work-indexes",
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

export default defineConfig({
  plugins: [workIndexes(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    watch: { ignored: ["**/public/work/**", "**/.readme-audit/**"] },
  },
})
