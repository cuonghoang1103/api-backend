// Twitter card image — Twitter caches these independently from
// Open Graph, but we want the same visual. We re-export the OG
// image component so both share one render path. The runtime
// stays 'edge' so the image is generated at the CDN edge, close
// to the scraper.
export { default, size, contentType, runtime, alt } from './opengraph-image'