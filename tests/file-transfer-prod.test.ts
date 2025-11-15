import { describe, it, expect } from 'vitest';
import { fileToBase64, serializeFileMessage, deserializeFileMessage } from '../lib/file-transfer';

describe('File Transfer - Production Environment', () => {
  console.log('\n🧪 Testing file transfer with 16KB chunks for production compatibility\n');

  it('should handle small file (1KB)', async () => {
    const content = 'a'.repeat(1024);
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    expect(result.success).toBe(true);
    expect(result.fileData).toBeDefined();
    expect(result.fileData!.name).toBe('test.txt');
  });

  it('should handle medium file (100KB)', async () => {
    const content = 'a'.repeat(100 * 1024);
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'medium.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    expect(result.success).toBe(true);
    expect(result.fileData).toBeDefined();
  });

  it('should chunk large files with 16KB chunks', async () => {
    const content = 'a'.repeat(100 * 1024);
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'large.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    const chunks = serializeFileMessage(result.fileData!);
    
    console.log(`\n100KB file: ${chunks.length} chunks created`);
    const maxSize = Math.max(...chunks.map(c => c.length));
    console.log(`Max chunk size: ${maxSize} bytes`);
    
    chunks.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(17000);
    });
  });

  it('should reassemble chunked file correctly', async () => {
    const content = 'test content for chunking';
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    const chunks = serializeFileMessage(result.fileData!);
    
    let reassembled: any = null;
    for (const chunk of chunks) {
      const partial = deserializeFileMessage(chunk);
      if (partial) {
        reassembled = partial;
      }
    }

    expect(reassembled).toBeDefined();
    expect(reassembled.name).toBe('test.txt');
    expect(reassembled.data).toBe(result.fileData!.data);
  });

  it('should handle image file', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.log('Canvas not available in test environment, skipping');
      return;
    }
    
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const file = new File([blob], 'test.png', { type: 'image/png' });

    const result = await fileToBase64(file);
    expect(result.success).toBe(true);
    expect(result.fileData!.type).toBe('image/png');
    expect(result.fileData!.data).toContain('data:image/png');
  });

  it('should reject files over 10MB', async () => {
    const content = 'a'.repeat(11 * 1024 * 1024);
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'toolarge.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    expect(result.success).toBe(false);
    expect(result.error).toContain('too large');
  });

  it('should handle chunk order correctly', async () => {
    const content = 'a'.repeat(50 * 1024);
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'order.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);
    const chunks = serializeFileMessage(result.fileData!);
    
    const shuffled = [...chunks].sort(() => Math.random() - 0.5);
    
    let reassembled: any = null;
    for (const chunk of shuffled) {
      const partial = deserializeFileMessage(chunk);
      if (partial) {
        reassembled = partial;
      }
    }

    expect(reassembled).toBeDefined();
    expect(reassembled.data).toBe(result.fileData!.data);
  });

  it('should measure chunk sizes for production limits', async () => {
    const sizes = [1, 10, 50, 100, 500, 1000];
    
    console.log('\n=== Chunk Size Analysis for Production ===');
    for (const sizeKB of sizes) {
      const content = 'a'.repeat(sizeKB * 1024);
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], `test-${sizeKB}kb.txt`, { type: 'text/plain' });

      const result = await fileToBase64(file);
      const chunks = serializeFileMessage(result.fileData!);
      
      const maxChunkSize = Math.max(...chunks.map(c => c.length));
      const avgChunkSize = Math.round(chunks.reduce((sum, c) => sum + c.length, 0) / chunks.length);
      console.log(`${sizeKB}KB: ${chunks.length} chunks | max: ${maxChunkSize}B | avg: ${avgChunkSize}B`);
      
      expect(maxChunkSize).toBeLessThanOrEqual(17000);
    }
    console.log('==========================================\n');
  });
});
