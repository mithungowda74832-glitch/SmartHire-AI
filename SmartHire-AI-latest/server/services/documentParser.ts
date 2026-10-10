import mammoth from 'mammoth';

export interface ParsedDocument {
  text: string;
  pdfBase64?: string;
  mimeType: string;
  charCount: number;
}

/**
 * Extracts content from PDF, DOCX, or plain text resume buffers.
 */
export async function parseDocument(
  buffer: Buffer,
  originalFilename: string,
  mimetype: string
): Promise<ParsedDocument> {
  const lowerName = originalFilename.toLowerCase();

  // 1. Plain text (.txt)
  if (lowerName.endsWith('.txt') || mimetype === 'text/plain') {
    const text = buffer.toString('utf-8');
    return {
      text: text.trim(),
      mimeType: 'text/plain',
      charCount: text.length,
    };
  }

  // 2. Microsoft Word (.docx)
  if (
    lowerName.endsWith('.docx') ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      return {
        text,
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        charCount: text.length,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse DOCX document: ${msg}`);
    }
  }

  // 3. PDF (.pdf)
  if (lowerName.endsWith('.pdf') || mimetype === 'application/pdf') {
    // Gemini 3.8 Flash natively accepts PDF documents as inlineData
    // We pass both base64 and extract basic ASCII strings where possible
    const pdfBase64 = buffer.toString('base64');
    const estimatedChars = Math.round(buffer.length * 0.4);

    return {
      text: '', // Gemini will read the PDF inlineData directly
      pdfBase64,
      mimeType: 'application/pdf',
      charCount: estimatedChars,
    };
  }

  throw new Error(
    `Unsupported file format (${originalFilename}). Please upload a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) document.`
  );
}
