/**
 * Utility to convert Google Drive sharing links into direct image source URLs.
 */
export function convertGoogleDriveUrl(url: string): {
  convertedUrl: string;
  fileId: string | null;
  isDriveUrl: boolean;
  error?: string;
} {
  if (!url) {
    return { convertedUrl: '', fileId: null, isDriveUrl: false };
  }

  const trimmedUrl = url.trim();
  const isDriveUrl =
    trimmedUrl.includes('drive.google.com') ||
    trimmedUrl.includes('docs.google.com') ||
    trimmedUrl.includes('google.com/file');

  if (!isDriveUrl) {
    return { convertedUrl: trimmedUrl, fileId: null, isDriveUrl: false };
  }

  // Regex patterns to match File ID
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // /file/d/ID/view
    /[?&]id=([a-zA-Z0-9_-]+)/,     // ?id=ID
    /\/uc\?id=([a-zA-Z0-9_-]+)/,   // /uc?id=ID
    /\/open\?id=([a-zA-Z0-9_-]+)/, // /open?id=ID
  ];

  let fileId: string | null = null;
  for (const pattern of patterns) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      fileId = match[1];
      break;
    }
  }

  if (fileId) {
    // The lh3.googleusercontent.com endpoint is the most reliable direct image renderer
    return {
      convertedUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
      fileId,
      isDriveUrl: true,
    };
  }

  return {
    convertedUrl: trimmedUrl,
    fileId: null,
    isDriveUrl: true,
    error: 'Could not extract File ID. Please make sure the URL contains /file/d/ or ?id='
  };
}
