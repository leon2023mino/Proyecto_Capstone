export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Ajustar proporción
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No se pudo obtener contexto del canvas");

      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a blob (JPEG o WEBP para ahorrar espacio)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resized = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, ".webp"),
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );
            resolve(resized);
          } else reject("Error al convertir a blob");
        },
        "image/webp",
        0.85 // calidad (0–1)
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
