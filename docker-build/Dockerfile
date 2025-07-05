# Use the official Node.js 20 image as the base (recommended for Next.js v15)
FROM node:20-slim AS base

ARG APP_ENV production
ARG NEXT_PUBLIC_POCKETBASE_URL https://pb.echa.ir
ARG REDIS_HOST
ARG REDIS_PORT
ARG POCKETBASE_ADMIN_USERNAME
ARG POCKETBASE_ADMIN_PASSWORD

# Set working directory inside the container
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies needed for sharp (image optimization) and other native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json, pnpm-lock.yaml, and any workspace files (if applicable)
COPY package.json pnpm-lock.yaml ./

# Install production dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of your Next.js project files
COPY . .

RUN ls -lash

# Build the Next.js app (generates optimized production build)
RUN pnpm build

# Expose the port Next.js will run on
EXPOSE 3000

# Command to start the Next.js app
CMD ["pnpm", "start"]

# Healthcheck to ensure the app is running (optional but recommended)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${PORT}/ || exit 1