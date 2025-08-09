# Cinematic AI SketchUp App

<<<<<<< f735rq-codex/build-responsive-multi-page-web-app
This project is a multi-page web application that converts uploaded CSV or SRT
script files into shot breakdowns using Replicate's MOE text model and
visualizes each shot using an image generation model. Bootstrap 5 provides the
responsive interface, animated gradient backgrounds keep the UI lively, and each
generated shot is displayed in a card with repaint, regenerate, and download
controls. The app supports seed management, props and location hints, and
optional LoRA reference images for actor consistency.
=======
This project is a multi-page web application that converts uploaded CSV or SRT script files into shot breakdowns using Replicate's MOE text model and visualizes each shot using an image generation model. Bootstrap 5 provides the responsive interface and each generated shot is displayed in a card with repaint, regenerate, and download controls. The app supports seed management, props and location hints, and optional LoRA reference images for actor consistency.
>>>>>>> main

## Features
- Upload `.csv` or `.srt` files
- Automatic shot breakdown generation
- Image generation for each shot with repaint/regenerate options
<<<<<<< f735rq-codex/build-responsive-multi-page-web-app
- Progress bars with real-time percentage updates for breakdown and image generation
=======
>>>>>>> main
- Settings page for API key and model selection
- Props and LoRA configuration
- Mobile-first responsive layout using Bootstrap 5

## Development
1. Run `./setup.sh` to install dependencies and set the Replicate API key.
2. Access the app at [http://localhost:3000](http://localhost:3000).

## Folder Structure
```
<<<<<<< f735rq-codex/build-responsive-multi-page-web-app
public/         static pages and styles
src/js/         front-end logic
src/components/ reusable UI components
src/utils/      utility functions
=======
public/        static pages and styles
src/js/        front-end logic
src/components reusable UI components
src/utils/     utility functions
>>>>>>> main
```

## Notes
API responses are proxied through a lightweight Express server. If the Replicate API is unreachable, placeholder data is returned so the interface remains functional.
