#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Setting up environment..."
if [ ! -f .env ]; then
  touch .env
fi
if ! grep -q REPLICATE_API_KEY .env; then
  read -p "Enter your Replicate API Key: " key
  echo "REPLICATE_API_KEY=$key" >> .env
fi

echo "Starting server..."
npm start
