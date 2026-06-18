/**
 * Cloudflare R2 storage client.
 *
 * R2 is an S3-compatible object storage. We use the official AWS
 * SDK v3 (`@aws-sdk/client-s3`) with the R2 endpoint and a
 * couple of R2-specific tweaks:
 *   - region: "auto"  — R2 ignores the region; required by the SDK
 *   - forcePathStyle: false — R2 prefers virtual-hosted-style URLs
 *
 * The client is created lazily on first use so the app can still
 * boot in environments that don't have R2 credentials (e.g. a
 * contributor's local dev box running only the test suite).
 *
 * Public URL vs signed URL:
 *   - Public bucket objects: served via the custom domain (e.g.
 *     `https://media.cuongthai.com/<key>`) through Cloudflare CDN.
 *     This is what we use for everything that is safe to expose
 *     (avatars, post images, lesson thumbnails, music). The CDN
 *     handles caching, range requests, and global edge delivery.
 *   - Signed URLs: used only for files that should not be world-
 *     readable (e.g. paid course documents behind an enrollment
 *     check). Signed URLs are short-lived (5-10 minutes) and
 *     point at the R2 endpoint, not the CDN.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './env.js';

let cachedClient: S3Client | null = null;

/**
 * Get the S3-compatible R2 client. Throws if R2 isn't configured
 * so callers can fail fast with a clear error instead of a vague
 * "fetch failed" later in the pipeline.
 */
export function getR2Client(): S3Client {
  if (!config.r2.enabled) {
    throw new Error(
      'Cloudflare R2 is not configured. Set R2_BUCKET_NAME, R2_ENDPOINT_URL, ' +
        'R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your environment.',
    );
  }
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    region: config.r2.region,
    endpoint: config.r2.endpoint,
    // R2 credentials are long-lived API tokens, not the rotating
    // IAM keys that AWS uses. The SDK doesn't care; we just pass
    // them through.
    credentials: {
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
    },
    // R2 supports virtual-hosted-style for custom domains; path-
    // style breaks the SDK's URL signer for some operations.
    forcePathStyle: false,
  });

  return cachedClient;
}

/**
 * Upload a buffer to R2 under `key`. Returns the public URL the
 * file can be fetched from (via the CDN, not the R2 endpoint).
 *
 * `contentType` MUST be the proper MIME type. The CDN relies on
 * it for Content-Type negotiation, and browsers will reject
 * <audio>/<video> tags with the wrong type.
 *
 * `cacheControl` is forwarded to the CDN so we can tune cache
 * lifetimes per content type (e.g. 1 year for immutable images,
 * 1 hour for the audio streaming endpoints).
 */
export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
  cacheControl: string = 'public, max-age=31536000, immutable',
): Promise<{ key: string; url: string; etag?: string }> {
  const client = getR2Client();
  const cmd = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl,
  });
  const res = await client.send(cmd);
  return {
    key,
    url: buildPublicUrl(key),
    etag: res.ETag,
  };
}

/**
 * Delete a single object. We don't throw on `NoSuchKey` — the
 * desired end state ("object doesn't exist") is already met, and
 * a missing file shouldn't break the parent operation (e.g. a
 * user deleting a post that already lost its cover image).
 */
export async function deleteObject(key: string): Promise<void> {
  if (!config.r2.enabled) return;
  const client = getR2Client();
  const cmd = new DeleteObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
  });
  await client.send(cmd);
}

/**
 * Delete a batch of objects in one round-trip. Used by the
 * "delete a post and all its attachments" cleanup so we don't
 * burn 30 sequential DELETE calls.
 */
export async function deleteObjects(keys: string[]): Promise<void> {
  if (!config.r2.enabled || keys.length === 0) return;
  const client = getR2Client();
  // R2's batch delete is capped at 1000 keys per call. For our
  // workloads (a post rarely has more than 20 attachments) this
  // is plenty, but we chunk defensively in case someone bulk-
  // deletes a course with hundreds of documents.
  const chunks: string[][] = [];
  for (let i = 0; i < keys.length; i += 1000) {
    chunks.push(keys.slice(i, i + 1000));
  }
  for (const chunk of chunks) {
    const cmd = new DeleteObjectsCommand({
      Bucket: config.r2.bucketName,
      Delete: {
        Objects: chunk.map((k) => ({ Key: k })),
        Quiet: true,
      },
    });
    await client.send(cmd);
  }
}

/**
 * Check whether an object exists. Returns false on any error
 * (including 404) so callers can treat "file not there" as
 * "nothing to clean up" without try/catch noise.
 */
export async function objectExists(key: string): Promise<boolean> {
  if (!config.r2.enabled) return false;
  const client = getR2Client();
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a short-lived signed URL for private content. Used by
 * the course document download endpoint, which gates the file on
 * enrollment BEFORE handing the user a time-limited URL.
 *
 * Default TTL is 5 minutes — long enough for the user to click
 * "Download" without the URL expiring, short enough that a leaked
 * link is useless.
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 300,
  filename?: string,
): Promise<string> {
  const client = getR2Client();
  const cmd = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ...(filename
      ? {
          ResponseContentDisposition: `attachment; filename="${filename.replace(/[^\w.-]/g, '_')}"`,
        }
      : {}),
  });
  return getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
}

/**
 * Build the public URL for a key. The CDN (Cloudflare in front
 * of R2) is what users hit — not the raw R2 endpoint — so we
 * always go through the configured public URL.
 *
 * Keys are stored as relative paths (e.g. `images/avatar/abc.jpg`).
 * We never encode the slash; doing so would break the CDN cache
 * key for nested prefixes.
 */
export function buildPublicUrl(key: string): string {
  const base = config.r2.publicUrl || '';
  // Defensive: strip any leading slash on the key so we don't
  // produce `//` in the URL.
  return `${base}/${key.replace(/^\/+/, '')}`;
}

/**
 * Extract the R2 key from a public URL. Used when the caller
 * gives us a URL (e.g. from a `coverImage` column) and we need
 * to delete the underlying object. Returns `null` if the URL
 * isn't one of ours (e.g. a YouTube thumbnail, an OAuth avatar).
 */
export function keyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const base = config.r2.publicUrl;
  if (!base) return null;
  if (!url.startsWith(base + '/')) return null;
  return url.slice(base.length + 1);
}

/**
 * Test that R2 is reachable. Called from the /health endpoint and
 * from the migration script before it starts uploading thousands
 * of files. Returns a plain `true`/`false` so callers don't have
 * to wrap it in try/catch.
 */
export async function pingR2(): Promise<boolean> {
  if (!config.r2.enabled) return false;
  try {
    const client = getR2Client();
    // HeadBucket is the cheapest "is the bucket there?" call.
    const { HeadBucketCommand } = await import('@aws-sdk/client-s3');
    await client.send(new HeadBucketCommand({ Bucket: config.r2.bucketName }));
    return true;
  } catch {
    return false;
  }
}
