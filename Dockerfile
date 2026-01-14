# Force Railway to use this custom Dockerfile instead of automatic build
# This will clear all caches and do a fresh build
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the application
RUN pnpm run build

# Start the application
EXPOSE 8080
CMD ["pnpm", "run", "start"]
