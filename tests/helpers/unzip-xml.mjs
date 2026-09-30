// Mínimo lector zip (solo archivos stored/deflate) para inspeccionar .docx en tests.
import { inflateRawSync } from 'zlib';

export function unzipXml(buf, name) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  let off = 0;
  while (off < b.length - 30) {
    if (b.readUInt32LE(off) !== 0x04034b50) break;
    const method = b.readUInt16LE(off + 8);
    const compLen = b.readUInt32LE(off + 18);
    const nameLen = b.readUInt16LE(off + 26);
    const extraLen = b.readUInt16LE(off + 28);
    const fname = b.toString('utf8', off + 30, off + 30 + nameLen);
    const dataStart = off + 30 + nameLen + extraLen;
    if (fname === name) {
      const raw = b.subarray(dataStart, dataStart + compLen);
      const out = method === 8 ? inflateRawSync(raw) : raw;
      return out.toString('utf-8');
    }
    off = dataStart + compLen;
  }
  throw new Error('No se encontró ' + name + ' en el zip');
}
