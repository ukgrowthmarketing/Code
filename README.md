# Cinematic AI SketchUp App

This project is a multi-page web application that converts uploaded CSV, SRT,
TXT, PDF, or XLSX script files (or a Google Sheet URL) into shot breakdowns using Replicate's
MOE text model and
visualizes each shot using an image generation model. Bootstrap 5 provides the
responsive interface, animated gradient backgrounds keep the UI lively, and each
generated shot is displayed in a card with repaint, regenerate, and download
controls. The app supports seed management, props and location hints, and
optional LoRA reference images for actor consistency.

## Features
- Upload `.csv`, `.srt`, `.txt`, `.pdf`, or `.xlsx` files, or provide a Google Sheet URL
- Automatic shot breakdown generation
- Image generation for each shot with repaint/regenerate options
- Auto-generated filenames with option to rename before download
- Progress bars with real-time percentage updates for breakdown and image generation
- Manual image generation from an ad‑hoc prompt on the images page
- Ongoing task page that tracks breakdown and image-generation progress even when switching tabs
- Basic render playground for arranging generated shots on a simple timeline
- Settings page for API key and model selection
- Props and LoRA configuration
- Mobile-first responsive layout using Bootstrap 5

## Development
1. Run `./setup.sh` to install dependencies and set the Replicate API key.
2. Access the app at [http://localhost:3000](http://localhost:3000).

## Folder Structure
```
public/         static pages and styles
src/js/         front-end logic
src/components/ reusable UI components
src/utils/      utility functions
```

## Notes
API responses are proxied through a lightweight Express server. If the Replicate API is unreachable, placeholder data is returned so the interface remains functional.
