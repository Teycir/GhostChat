export async function stripImageMetadata(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context failed'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(file.type || 'image/png'));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
}
