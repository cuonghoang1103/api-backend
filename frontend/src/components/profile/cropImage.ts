/**
 * cropImage — canvas helper for react-easy-crop.
 *
 * Takes a source image (data URL or blob URL) plus the pixel-crop
 * rectangle that `react-easy-crop` reports via `onCropComplete`, and
 * returns a JPEG `Blob` of just the cropped region. Used by the
 * profile avatar (square/circular) and cover (16:6) upload flows
 * before handing the blob to `fileApi.upload` → R2.
 */

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    // Avoid tainting the canvas for remote images.
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

/**
 * Crop `imageSrc` to `pixelCrop` and return a JPEG blob.
 * Throws if the 2D context or blob can't be produced.
 */
export async function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không khởi tạo được canvas');

  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Không tạo được ảnh đã cắt'));
      },
      'image/jpeg',
      0.92,
    );
  });
}
