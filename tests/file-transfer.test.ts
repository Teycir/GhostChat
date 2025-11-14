import { serializeFileMessage, deserializeFileMessage, FileData } from '../lib/file-transfer';

// Test: Chunk -> Send -> Reassemble -> Show

console.log('=== File Transfer Test ===\n');

// 1. Create mock file data
const mockFileData: FileData = {
  name: 'test.pdf',
  size: 1000,
  type: 'application/pdf',
  data: 'data:application/pdf;base64,' + 'A'.repeat(200000) // Large enough to chunk
};

console.log('1. Created mock file:', mockFileData.name, mockFileData.size, 'bytes');

// 2. Serialize (chunk)
const chunks = serializeFileMessage(mockFileData);
console.log('2. Serialized into', chunks.length, 'chunks');
console.log('   First chunk preview:', chunks[0].slice(0, 100));

// 3. Simulate sending/receiving each chunk
console.log('\n3. Simulating chunk transmission:');
let reassembledFile: FileData | null = null;

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const parsed = JSON.parse(chunk);
  console.log(`   Processing chunk ${i + 1}/${chunks.length}, chunkId: ${parsed.chunkId}`);
  
  // 4. Deserialize each chunk
  const result = deserializeFileMessage(chunk);
  
  if (result) {
    reassembledFile = result;
    console.log(`   ✓ File reassembled after chunk ${i + 1}`);
    break;
  } else {
    console.log(`   - Chunk ${i + 1} buffered, waiting for more...`);
  }
}

// 5. Verify reassembly
console.log('\n4. Verification:');
if (reassembledFile) {
  console.log('   ✓ File reassembled successfully');
  console.log('   Name:', reassembledFile.name);
  console.log('   Size:', reassembledFile.size);
  console.log('   Type:', reassembledFile.type);
  console.log('   Data length:', reassembledFile.data.length);
  console.log('   Match:', reassembledFile.data === mockFileData.data ? '✓ YES' : '✗ NO');
} else {
  console.log('   ✗ FAILED: File not reassembled');
}

console.log('\n=== Test Complete ===');
