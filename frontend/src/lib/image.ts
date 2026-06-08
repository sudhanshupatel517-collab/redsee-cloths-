/**
 * Optimizes image URLs for Cloudinary and Unsplash by appending width, quality, and format parameters.
 * 
 * @param url The original image URL
 * @param width The target width for the image (optional)
 * @returns The optimized image URL
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url) return "";

  // 1. Cloudinary Optimization
  if (url.includes("res.cloudinary.com")) {
    // Check if the URL has the standard upload path
    if (url.includes("/image/upload/")) {
      const w = width ? `,w_${width}` : "";
      // Insert f_auto,q_auto,c_limit and optional width right after /upload/
      return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit${w}/`);
    }
  }

  // 2. Unsplash Optimization
  if (url.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(url);
      // Automatically use WebP/AVIF format
      urlObj.searchParams.set("auto", "format");
      // Set reasonable compression quality
      urlObj.searchParams.set("q", "80");
      // If width is specified, set it, otherwise limit to a reasonable default like 1200
      if (width) {
        urlObj.searchParams.set("w", width.toString());
      } else if (!urlObj.searchParams.has("w")) {
        urlObj.searchParams.set("w", "1200");
      }
      return urlObj.toString();
    } catch (e) {
      // Fallback in case URL constructor fails (e.g. invalid URL)
      return url;
    }
  }

  return url;
}
