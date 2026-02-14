import {
  stripDataUri,
  toDataUri,
  base64ToBuffer,
  bufferToDataUri,
  detectMimeType,
} from '@/lib/imageUtils';

describe('stripDataUri', () => {
  it('strips data URI prefix', () => {
    expect(stripDataUri('data:image/png;base64,abc123')).toBe('abc123');
  });

  it('returns raw base64 unchanged', () => {
    expect(stripDataUri('abc123')).toBe('abc123');
  });
});

describe('toDataUri', () => {
  it('wraps raw base64 with data URI prefix', () => {
    expect(toDataUri('abc123', 'image/jpeg')).toBe('data:image/jpeg;base64,abc123');
  });

  it('returns existing data URI unchanged', () => {
    const uri = 'data:image/png;base64,abc123';
    expect(toDataUri(uri)).toBe(uri);
  });

  it('uses image/png as default mime type', () => {
    expect(toDataUri('abc123')).toBe('data:image/png;base64,abc123');
  });
});

describe('base64ToBuffer', () => {
  it('converts base64 to Buffer', () => {
    const buffer = base64ToBuffer('aGVsbG8='); // "hello"
    expect(buffer.toString('utf8')).toBe('hello');
  });

  it('handles data URI prefix', () => {
    const buffer = base64ToBuffer('data:image/png;base64,aGVsbG8=');
    expect(buffer.toString('utf8')).toBe('hello');
  });
});

describe('bufferToDataUri', () => {
  it('converts Buffer to data URI', () => {
    const buffer = Buffer.from('hello');
    const uri = bufferToDataUri(buffer, 'image/png');
    expect(uri).toBe('data:image/png;base64,aGVsbG8=');
  });
});

describe('detectMimeType', () => {
  it('detects mime type from data URI', () => {
    expect(detectMimeType('data:image/png;base64,abc')).toBe('image/png');
    expect(detectMimeType('data:image/jpeg;base64,abc')).toBe('image/jpeg');
  });

  it('returns null for non-data URIs', () => {
    expect(detectMimeType('abc123')).toBeNull();
  });
});
