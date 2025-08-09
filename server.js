import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.post('/api/shot-breakdown', async (req, res) => {
  const { lines, textModel, apiKey } = req.body;
  const key = apiKey || process.env.REPLICATE_API_KEY;
  if (!key) return res.status(400).json({ error: 'Missing API key' });
  const prompt = lines.map(l => `${l.Timecode || ''} ${l.Subtitle || l.Subtitles || ''}`).join('\n');
  try {
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${key}`
      },
      body: JSON.stringify({
        model: textModel || 'meta/moe',
        input: { prompt: `Return JSON array of shot breakdowns for script:\n${prompt}` }
      })
    });
    let prediction = await createRes.json();
    while (prediction.status && prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${key}` }
      });
      prediction = await poll.json();
    }
    if (prediction.status !== 'succeeded') throw new Error(prediction.error || 'Failed');
    const output = typeof prediction.output === 'string' ? JSON.parse(prediction.output) : prediction.output;
    res.json(output);
  } catch (err) {
    console.error(err);
    const fallback = lines.map(l => ({
      Timecode: l.Timecode || '',
      Subtitle: l.Subtitle || l.Subtitles || '',
      Location: '',
      Character: '',
      'Shot angle type': '',
      'Shot description': '',
      'Respective text-to-image Prompt': l.Subtitle || l.Subtitles || ''
    }));
    res.json(fallback);
  }
});

app.post('/api/generate-image', async (req, res) => {
  const { prompt, seed, imageModel, apiKey, props } = req.body;
  const key = apiKey || process.env.REPLICATE_API_KEY;
  if (!key) return res.status(400).json({ error: 'Missing API key' });
  const promptWithProps = `${prompt}${props && props.location ? ' in ' + props.location : ''}${props && props.props ? ', with ' + props.props : ''}`;
  try {
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${key}`
      },
      body: JSON.stringify({
        model: imageModel || 'stability-ai/stable-diffusion',
        input: { prompt: promptWithProps, seed }
      })
    });
    let prediction = await createRes.json();
    while (prediction.status && prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Token ${key}` }
      });
      prediction = await poll.json();
    }
    if (prediction.status !== 'succeeded') throw new Error(prediction.error || 'Failed');
    const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    res.json({ image: output });
  } catch (err) {
    console.error(err);
    res.json({ image: 'https://via.placeholder.com/512?text=Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
