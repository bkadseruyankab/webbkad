#!/bin/bash
# Start the development environment for BKAD website

cd /home/z/my-project

# Kill any existing processes
pkill -f "next dev" 2>/dev/null || true
pkill -f "file-server/index" 2>/dev/null || true
sleep 2

# Ensure public/uploads exists
mkdir -p public/uploads

# Sync external upload files to public/uploads
if [ -d "/home/z/my-project/upload" ]; then
  for f in /home/z/my-project/upload/*; do
    if [ -f "$f" ]; then
      filename=$(basename "$f")
      if [ ! -f "public/uploads/$filename" ]; then
        cp "$f" "public/uploads/" 2>/dev/null || true
        echo "Synced: $filename"
      fi
    fi
  done
fi

# Start the file server mini-service
cd /home/z/my-project/mini-services/file-server
nohup bun index.ts > /home/z/my-project/mini-services/file-server/log.txt 2>&1 &
echo "File server started on port 3001"

# Start Next.js dev server
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=1536"
nohup npx next dev -p 3000 > /home/z/my-project/dev.log 2>&1 &
echo "Next.js dev server started on port 3000"

echo "All services started!"
