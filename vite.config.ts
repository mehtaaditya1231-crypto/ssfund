import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, Plugin } from "vite";
import contactHandler from "./api/contact.ts";

function contactApiDevPlugin(): Plugin {
  return {
    name: "contact-api-dev-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/contact") {
          const enhancedRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return enhancedRes;
            },
            json(data: any) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return enhancedRes;
            },
          });
          try {
            await contactHandler(req, enhancedRes);
          } catch (err) {
            enhancedRes.status(500).json({ success: false, error: "Internal server error." });
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contactApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});

