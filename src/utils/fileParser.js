export async function parseFile(file) {
  const text = await file.text();
  if (file.name.toLowerCase().endsWith('.csv')) {
    return parseCSV(text);
  }
  if (file.name.toLowerCase().endsWith('.srt')) {
    return parseSRT(text);
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
