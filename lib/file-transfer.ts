export interface FileData {
  name: string;
  size: number;
  type: string;
  data: string;
}

export interface FileTransferResult {
  success: boolean;
  error?: string;
  fileData?: FileData;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CHUNK_SIZE = 64 * 1024;

export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}

export function getMaxFileSizeMB(): number {
  return MAX_FILE_SIZE / (1024 * 1024);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Max ${getMaxFileSizeMB()}MB.` };
  }
  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }
  return { valid: true };
}

export async function fileToBase64(file: File): Promise<FileTransferResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result as string
        }
      });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' });
    };
    reader.readAsDataURL(file);
  });
}

export function serializeFileMessage(fileData: FileData): string[] {
  const json = JSON.stringify({ type: 'file', file: fileData });
  if (json.length <= CHUNK_SIZE) {
    return [json];
  }
  
  const chunks: string[] = [];
  const totalChunks = Math.ceil(json.length / CHUNK_SIZE);
  const chunkId = Math.random().toString(36).substr(2, 9);
  
  for (let i = 0; i < totalChunks; i++) {
    const chunk = json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    chunks.push(JSON.stringify({
      type: 'file-chunk',
      chunkId,
      index: i,
      total: totalChunks,
      data: chunk
    }));
  }
  
  return chunks;
}

const chunkBuffer: Map<string, { chunks: string[], total: number }> = new Map();

export function deserializeFileMessage(data: string): FileData | null {
  try {
    const parsed = JSON.parse(data);
    
    if (parsed.type === 'file' && parsed.file) {
      return parsed.file;
    }
    
    if (parsed.type === 'file-chunk') {
      const { chunkId, index, total, data: chunkData } = parsed;
      
      if (!chunkBuffer.has(chunkId)) {
        chunkBuffer.set(chunkId, { chunks: new Array(total).fill(null), total });
      }
      
      const buffer = chunkBuffer.get(chunkId)!;
      buffer.chunks[index] = chunkData;
      
      const complete = buffer.chunks.every(c => c !== undefined && c !== null);
      if (complete) {
        const fullData = buffer.chunks.join('');
        chunkBuffer.delete(chunkId);
        const fileMsg = JSON.parse(fullData);
        return fileMsg.type === 'file' && fileMsg.file ? fileMsg.file : null;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export function isImageFile(fileData: FileData): boolean {
  return fileData.type.startsWith('image/');
}

export function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}
