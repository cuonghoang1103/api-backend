/**
 * Server-side API base URL resolver.
 *
 * The /api/v1 rewrite in next.config.js only works for fetch
 * calls made by Next.js request handlers (route handlers,
 * server actions, getServerSideProps). It does NOT work for
 * `fetch` calls inside a React Server Component, which is
 * what /repos does for its initial SSR data load.
 *
 * So RSC fetches need an absolute URL. We have two options:
 *
 *  1. process.env.NEXT_PUBLIC_API_URL — public URL of the API
 *     (https://api.cuongthai.com). Browser-safe. From the
 *     server, this means going out to the internet and back
 *     through nginx — adds 3-5 seconds of latency on cold
 *     fetches because the request has to do a TLS handshake
 *     with itself. We saw /repos take 8 seconds to first
 *     paint because of this.
 *
 *  2. process.env.API_INTERNAL_URL — Docker service URL
 *     (http://backend:3001). Server-only. Skips the public
 *     network entirely. The Docker compose file already
 *     creates a private network between frontend and backend,
 *     so requests go service-to-service. Latency is ~50ms.
 *
 * We default to (2) on the server and fall back to (2)'s
 * hard-coded value if neither env is set. The client side
 * never imports this file — it uses the /api/v1 rewrite.
 *
 * `NEXT_PUBLIC_*` vars are inlined at build time, so this
 * file must NOT reference them at module top level (or we'd
 * bake the public URL into the bundle). We read the
 * non-public env var at call time instead.
 */
export function getServerApiBaseUrl(): string {
  // Direct env read at call time — never bake this into a
  // shared constant. The container's runtime env is what we
  // want; the build-time value would be wrong because docker
  // compose may not have set it during `npm run build`.
  return (
    process.env.API_INTERNAL_URL ||
    process.env.BACKEND_INTERNAL_URL ||
    'http://cuonghoangdev_backend:3001'
  )
}
