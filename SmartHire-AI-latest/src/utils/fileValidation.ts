export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateResumeFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was selected.' };
  }

  // Size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMb} MB) exceeds the maximum allowed limit of 10 MB. Please upload a smaller document.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes). Please upload a valid resume document.',
    };
  }

  // Type & extension validation
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';

  if (!hasValidExtension && !hasValidMime) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) document.',
    };
  }

  return { valid: true };
}
