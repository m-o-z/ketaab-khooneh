/**
 * Maps file extensions to MIME types
 */
const EXTENSION_TO_MIME: Record<string, string> = {
  // Image formats
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  tiff: "image/tiff",
  tif: "image/tiff",
};

/**
 * Maps MIME types to canvas-compatible output formats
 */
const CANVAS_OUTPUT_FORMATS: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  // Fallback for unsupported formats
  "image/gif": "image/png", // Canvas can't output GIF, convert to PNG
  "image/bmp": "image/png",
  "image/tiff": "image/png",
  "image/svg+xml": "image/png",
};

/**
 * Extracts file extension from URL
 */
function getExtensionFromUrl(url: string): string | null {
  try {
    // Remove query parameters and hash
    const cleanUrl = url.split("?")[0].split("#")[0];
    const lastDotIndex = cleanUrl.lastIndexOf(".");

    if (lastDotIndex === -1) return null;

    return cleanUrl.substring(lastDotIndex + 1).toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Gets MIME type from URL extension
 */
function getMimeTypeFromUrl(url: string): string {
  const extension = getExtensionFromUrl(url);
  return extension
    ? EXTENSION_TO_MIME[extension] || "image/jpeg"
    : "image/jpeg";
}

/**
 * Gets the appropriate canvas output format
 */
function getCanvasOutputFormat(mimeType: string): string {
  return CANVAS_OUTPUT_FORMATS[mimeType] || "image/jpeg";
}

/**
 * Gets quality setting based on format
 */
function getQualityForFormat(outputFormat: string): number {
  switch (outputFormat) {
    case "image/jpeg":
      return 0.9;
    case "image/webp":
      return 0.9;
    default:
      return 1.0; // PNG doesn't use quality parameter
  }
}

/**
 * Generates appropriate filename with correct extension
 */
function generateFileName(
  url: string,
  outputFormat: string,
  customFileName?: string,
): string {
  if (customFileName) {
    // If custom filename has extension, use it
    if (customFileName.includes(".")) {
      return customFileName;
    }
    // Add appropriate extension based on output format
    const extension = getExtensionFromOutputFormat(outputFormat);
    return `${customFileName}.${extension}`;
  }

  // Extract filename from URL
  const urlParts = url.split("/");
  const originalFileName = urlParts[urlParts.length - 1].split("?")[0];

  if (originalFileName && originalFileName.includes(".")) {
    // Replace extension with output format extension
    const nameWithoutExt = originalFileName.substring(
      0,
      originalFileName.lastIndexOf("."),
    );
    const extension = getExtensionFromOutputFormat(outputFormat);
    return `${nameWithoutExt}.${extension}`;
  }

  // Fallback
  const extension = getExtensionFromOutputFormat(outputFormat);
  return `downloaded-image.${extension}`;
}

/**
 * Gets file extension from MIME type
 */
function getExtensionFromOutputFormat(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

/**
 * Downloads an image from a URL using canvas and converts it to a File object with proper MIME type.
 * @param {string} url The URL of the image to download.
 * @param {string} [fileName] Optional: The desired file name.
 * @param {Object} [options] Optional: Configuration options.
 * @param {boolean} [options.preserveFormat=true] Whether to preserve original format when possible.
 * @param {number} [options.maxWidth] Maximum width for resizing.
 * @param {number} [options.maxHeight] Maximum height for resizing.
 * @returns {Promise<File | undefined>} A Promise that resolves to a File object, or undefined if the download fails.
 */
export async function urlToFileImage(
  url: string,
  fileName?: string,
  options: {
    preserveFormat?: boolean;
    maxWidth?: number;
    maxHeight?: number;
  } = {},
): Promise<File | undefined> {
  const { preserveFormat = true, maxWidth, maxHeight } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Determine original and output MIME types
        const originalMimeType = getMimeTypeFromUrl(url);
        const outputFormat = preserveFormat
          ? getCanvasOutputFormat(originalMimeType)
          : "image/jpeg";

        // Calculate dimensions
        let { width, height } = img;

        if (maxWidth || maxHeight) {
          const aspectRatio = width / height;

          if (maxWidth && width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          if (maxHeight && height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Could not get canvas context");
          resolve(undefined);
          return;
        }

        canvas.width = width;
        canvas.height = height;

        // Handle PNG transparency
        if (outputFormat === "image/png") {
          ctx.clearRect(0, 0, width, height);
        } else {
          // Fill with white background for JPEG
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        const quality = getQualityForFormat(outputFormat);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const finalFileName = generateFileName(
                url,
                outputFormat,
                fileName,
              );
              const file = new File([blob], finalFileName, {
                type: outputFormat,
                lastModified: Date.now(),
              });

              console.log(
                `Created file: ${finalFileName} (${outputFormat}, ${blob.size} bytes)`,
              );
              resolve(file);
            } else {
              console.error("Failed to create blob from canvas");
              resolve(undefined);
            }
          },
          outputFormat,
          outputFormat === "image/png" ? undefined : quality,
        );
      } catch (error) {
        console.error("Error processing image:", error);
        resolve(undefined);
      }
    };

    img.onerror = (error) => {
      console.error("Failed to load image:", error);
      resolve(undefined);
    };

    // Handle timeout
    const timeout = setTimeout(() => {
      console.error("Image load timeout");
      resolve(undefined);
    }, 10000); // 10 seconds

    img.onload = ((originalOnLoad) =>
      function (this: HTMLImageElement, ev: Event) {
        clearTimeout(timeout);
        return originalOnLoad.call(this, ev);
      })(img.onload as (this: HTMLImageElement, ev: Event) => any);

    img.onerror = ((originalOnError) =>
      function (this: HTMLImageElement, ev: string | Event) {
        clearTimeout(timeout);
        return originalOnError.call(this, ev);
      })(img.onerror as OnErrorEventHandler);

    img.src = url;
  });
}

/**
 * Utility function to check if a URL points to a supported image format
 */
export function isSupportedImageUrl(url: string): boolean {
  const extension = getExtensionFromUrl(url);
  return extension ? extension in EXTENSION_TO_MIME : false;
}
