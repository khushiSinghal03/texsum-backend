import { pdfToText } from 'pdf-ts';
import mammoth from 'mammoth';

export async function extractTextFromFile(
  buffer: Buffer, 
  mimetype: string, 
  originalName: string
): Promise<string> {
  try {
    const fileNameLower = originalName.toLowerCase();

    // 1. PDF Handling (Modern pdf-ts)
    if (mimetype === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
      console.log(`[FileService] Extracting PDF: ${originalName}`);
      
      // pdfToText returns a Promise<string>
      const text = await pdfToText(buffer);
      
      if (!text || text.trim().length === 0) {
        throw new Error('PDF is empty or contains only images (OCR required).');
      }
      
      return text;
    }

    // 2. Word Handling (.docx)
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileNameLower.endsWith('.docx')
    ) {
      console.log(`[FileService] Extracting Word: ${originalName}`);
      const data = await mammoth.extractRawText({ buffer });
      return data.value;
    }

    // 3. Plain Text Handling (.txt)
    if (mimetype === 'text/plain' || fileNameLower.endsWith('.txt')) {
      console.log(`[FileService] Extracting TXT: ${originalName}`);
      return buffer.toString('utf8');
    }

    throw new Error('Unsupported file type. Please use PDF, DOCX, or TXT.');
  } catch (err: any) {
    console.error('--- Extraction Error ---');
    console.error(err.message);
    throw new Error(`Failed to read file: ${err.message}`);
  }
}