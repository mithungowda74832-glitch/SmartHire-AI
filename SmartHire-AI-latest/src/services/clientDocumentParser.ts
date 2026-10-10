import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure bundled local worker for PDF.js - zero runtime CDN calls
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
}

export interface ClientParsedDocument {
  text: string;
  wordCount: number;
  charCount: number;
  format: 'pdf' | 'docx' | 'txt';
  pageCount?: number;
}

/**
 * Extracts raw textual content from uploaded file completely inside the client browser.
 * Supports PDF, DOCX, and TXT without transmitting any data over the network.
 */
export async function parseDocumentLocally(file: File): Promise<ClientParsedDocument> {
  const name = file.name.toLowerCase();

  // 1. Plain text (.txt)
  if (name.endsWith('.txt') || file.type === 'text/plain') {
    const text = await file.text();
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    return {
      text: cleanText,
      wordCount: words,
      charCount: cleanText.length,
      format: 'txt',
      pageCount: Math.max(1, Math.ceil(words / 450)),
    };
  }

  // 2. Microsoft Word (.docx)
  if (
    name.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const cleanText = result.value.trim();
      if (!cleanText) {
        throw new Error('No readable text could be extracted from this DOCX file. It may be empty or contain only embedded non-vector images.');
      }
      const words = cleanText.split(/\s+/).length;
      return {
        text: cleanText,
        wordCount: words,
        charCount: cleanText.length,
        format: 'docx',
        pageCount: Math.max(1, Math.ceil(words / 450)),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Offline DOCX parsing error: ${msg}. You can also convert to PDF or .txt for instant offline analysis.`);
    }
  }

  // 3. PDF Document (.pdf)
  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const textPieces: string[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageString = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');
        textPieces.push(pageString);
      }

      const cleanText = textPieces.join('\n\n').replace(/\s+/g, ' ').trim();
      if (!cleanText || cleanText.length < 20) {
        throw new Error(
          'Could not extract text from this PDF. It appears to be a scanned image or bitmap. Offline analysis requires text-based PDF, DOCX, or TXT documents.'
        );
      }

      const words = cleanText.split(/\s+/).length;
      return {
        text: cleanText,
        wordCount: words,
        charCount: cleanText.length,
        format: 'pdf',
        pageCount: numPages,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Offline PDF parsing error: ${msg}`);
    }
  }

  throw new Error(
    `Unsupported file type (${file.name}). Please provide a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) document.`
  );
}
