/**
 * Downloads an image from a URL and converts it to a File object.
 * @param {string} url The URL of the image to download.
 * @param {string} [fileName] Optional: The desired file name. If not provided, it's inferred from the URL.
 * @returns {Promise<File | undefined>} A Promise that resolves to a File object, or undefined if the download fails.
 */
export async function urlToFile(
  url: string,
  fileName?: string,
): Promise<File | undefined> {
  try {
    // Step 1: Fetch the image data
    const response = await fetch(url);

    // Step 2: Check if the request was successful
    if (!response.ok) {
      console.error(`Failed to fetch image. Status: ${response.status}`);
      return undefined;
    }

    // Step 3: Get the image data as a Blob
    const blob = await response.blob();

    // Step 4: Determine the file name
    const finalFileName =
      fileName || url.substring(url.lastIndexOf("/") + 1) || "downloaded-image";

    // Step 5: Create and return a File object
    return new File([blob], finalFileName, { type: blob.type });
  } catch (error) {
    console.error("Error downloading the image:", error);
    return undefined;
  }
}
