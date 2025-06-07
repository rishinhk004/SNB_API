#!/bin/bash

# Fail on error
set -e

echo "Pulling latest code from main..."
git pull origin main

echo "Installing and building project..."
pnpm install
pnpm build

echo "Generating Prisma client..."
pnpm prisma generate

echo "Pushing Prisma schema to database..."
pnpm prisma db push

echo "Restarting PM2 service 'snbApi'..."
pm2 restart snbApi

echo "Reloading Nginx..."
sudo nginx -s reload

echo "Deployment completed successfully!"
