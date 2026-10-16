// Bun full-stack server: HTML imports are bundled on the fly in development (with HMR)
// and ahead of time by `bun run build`.
import guide from "./src/index.html";
import playbook from "./src/playbook.html";

const port = Number(Bun.env.PORT ?? 3000);

const server = Bun.serve({
  port,
  routes: {
    "/": guide,
    "/playbook": playbook,
  },
  development: Bun.env.NODE_ENV !== "production" && { hmr: true, console: true },
  fetch() {
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Pick Your Claude running at ${server.url}`);
