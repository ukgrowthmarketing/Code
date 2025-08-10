export async function parseFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) {
    const text = await file.text();
    return parseCSV(text);
  }
  if (name.endsWith('.srt')) {
    const text = await file.text();
    return parseSRT(text);
  }
  if (name.endsWith('.txt')) {
    const text = await file.text();
    return text.split(/\r?\n/).map(line => ({ Timecode: '', Subtitle: line }));
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const { read, utils } = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
    const buf = await file.arrayBuffer();
    const wb = read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return utils.sheet_to_json(sheet, { defval: '' });
  }
  if (name.endsWith('.pdf')) {
    const pdfjs = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.mjs');
    const data = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data }).promise;
    let lines = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const text = content.items.map(i => i.str).join(' ');
      lines.push(...text.split(/\r?\n/));
    }
    return lines.map(line => ({ Timecode: '', Subtitle: line }));
  }
  throw new Error('Unsupported file type');
}

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };
  const headers = parseLine(lines.shift());
  return lines.map(line => {
    const cols = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      let value = cols[i] || '';
      value = value.trim().replace(/^"|"$/g, '');
      obj[h.trim()] = value;
    });
    return obj;
  });
}

export function parseSRT(text) {
  const entries = text.trim().split(/\n\n+/);
  return entries.map(e => {
    const parts = e.split(/\n/);
    const time = parts[1] ? parts[1].split(' --> ')[0] : '';
    const subtitle = parts.slice(2).join(' ');
    return { Timecode: time, Subtitle: subtitle };
    });
  }
