# Use the official Node.js 18 image as the base image
FROM node:18-alpine
# Update
RUN apk add --no-cache libc6-compat
RUN apk update

RUN echo $$
# Install pnpm
RUN npm install -g pnpm

# Configure pnpm global
ENV PNPM_HOME=/pnpm-test/.pnpm
ENV PATH=$PATH:$PNPM_HOME

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies
RUN pnpm i

# Copy the rest of the application code

# Expose port 3000 to the outside world
EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]
