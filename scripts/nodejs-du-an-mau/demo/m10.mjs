import { fileTypeFromBuffer } from 'file-type';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX = 2 * 1024 * 1024;

async function checkUpload(name, buf) {
  if (buf.length > MAX) return 'reject: too large';
  const t = await fileTypeFromBuffer(buf);          // read the magic bytes, ignore the file name
  if (!t || !ALLOWED.has(t.mime)) return 'reject: real type is ' + (t ? t.mime : 'unknown');
  return 'accept as ' + t.mime + ' -> store as .' + t.ext;
}
const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
console.log('photo.jpg (really a PNG) :', await checkUpload('photo.jpg', png));
console.log('cute.png  (really a script):', await checkUpload('cute.png', Buffer.from('<?php system($_GET[1]); ?>')));
console.log('huge.png                 :', await checkUpload('huge.png', Buffer.alloc(MAX + 1)));

// Presigned URL: the browser uploads straight to object storage; the API never holds the bytes.
// Local S3-compatible store (MinIO) — never your production bucket while developing.
const s3 = new S3Client({ region: 'auto', endpoint: 'http://localhost:9000', forcePathStyle: true,
  credentials: { accessKeyId: 'local-dev', secretAccessKey: 'local-dev-secret' } });
const key = 'plants/10/' + crypto.randomUUID() + '.webp';
const url = new URL(await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'plant-photos', Key: key, ContentType: 'image/webp' }), { expiresIn: 300 }));
console.log('PUT to  :', url.origin + url.pathname.replace(/[0-9a-f-]{36}/, '<uuid>'));
console.log('expires :', url.searchParams.get('X-Amz-Expires'), 's, signed headers:', url.searchParams.get('X-Amz-SignedHeaders'));
