import { describe, it, expect } from 'vitest';
import { serializeFileMessage, deserializeFileMessage, FileData } from '../lib/file-transfer';

describe('File Transfer', () => {
  it('should chunk large files into multiple messages', () => {
    const mockFileData: FileData = {
      name: 'test.pdf',
      size: 1000,
      type: 'application/pdf',
      data: 'data:application/pdf;base64,' + 'A'.repeat(200000)
    };

    const chunks = serializeFileMessage(mockFileData);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('should reassemble chunked file data correctly', () => {
    const mockFileData: FileData = {
      name: 'test.pdf',
      size: 1000,
      type: 'application/pdf',
      data: 'data:application/pdf;base64,' + 'A'.repeat(200000)
    };

    const chunks = serializeFileMessage(mockFileData);
    let reassembledFile: FileData | null = null;
    
    for (const chunk of chunks) {
      const result = deserializeFileMessage(chunk);
      if (result) {
        reassembledFile = result;
        break;
      }
    }

    expect(reassembledFile).not.toBeNull();
    expect(reassembledFile?.name).toBe(mockFileData.name);
    expect(reassembledFile?.size).toBe(mockFileData.size);
    expect(reassembledFile?.type).toBe(mockFileData.type);
    expect(reassembledFile?.data).toBe(mockFileData.data);
  });
});
