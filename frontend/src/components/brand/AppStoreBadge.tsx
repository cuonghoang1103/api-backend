/**
 * Apple's official "Download on the App Store" badge (black), as published by
 * Apple Marketing Tools — `public/badges/download-on-the-app-store-{en,vi}.svg`
 * are the unmodified SVGs from
 * https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/{en-us,vi-vn}
 *
 * Apple's badge rules, which this component keeps:
 *   - the artwork is never redrawn, recoloured, cropped or animated;
 *   - at least 40px tall on screen (the default here);
 *   - clear space around it of at least ¼ of its height (the wrapper margin);
 *   - it links straight to the app's App Store page.
 */
interface Props {
  href: string;
  lang: 'en' | 'vi';
  /** Name of the app, for the accessible label ("Download CT Work on the App Store"). */
  appName: string;
  /** On-screen height in px — never below 40. */
  height?: number;
  className?: string;
}

const RATIO = 119.66407 / 40;

export default function AppStoreBadge({ href, lang, appName, height = 40, className }: Props) {
  const h = Math.max(40, height);
  const label = lang === 'vi' ? `Tải ${appName} trên App Store` : `Download ${appName} on the App Store`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={className}
      data-app-store-badge
      // Clear space on the sides where other content can sit; the left edge
      // lines up with the text column (a container edge is not artwork).
      style={{ display: 'inline-block', lineHeight: 0, margin: `${Math.ceil(h / 4)}px ${Math.ceil(h / 4)}px ${Math.ceil(h / 4)}px 0`, flexShrink: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/badges/download-on-the-app-store-${lang}.svg`}
        alt={label}
        width={Math.round(h * RATIO)}
        height={h}
        style={{ display: 'block', height: h, width: 'auto' }}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
