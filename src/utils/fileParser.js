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

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = cols[i] ? cols[i].trim() : '');
    return obj;
  });
}

function parseSRT(text) {
  const entries = text.trim().split(/\n\n+/);
  return entries.map(e => {
    const parts = e.split(/\n/);
    const time = parts[1] ? parts[1].split(' --> ')[0] : '';
    const subtitle = parts.slice(2).join(' ');
    return { Timecode: time, Subtitle: subtitle };
  });
}
