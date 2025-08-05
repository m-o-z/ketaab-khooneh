# ---- Builder Stage ----
# This stage builds the Go application
FROM golang:1.24-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to leverage Docker's build cache.
# This step only re-runs if these files change.
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application, creating a static binary.
# CGO_ENABLED=0 is important for a truly static binary.
# -o specifies the output file name.
RUN CGO_ENABLED=0 go build -o /app/pocketbase-app ./main.go


# ---- Final Stage ----
# This stage creates the final, minimal image
FROM alpine:latest
ARG VAPID_PUBLIC_KEY
ARG VAPID_PRIVATE_KEY
ARG APP_FRONTEND_URL
ENV VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY
ENV VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY
ENV APP_FRONTEND_URL=$APP_FRONTEND_URL

WORKDIR /app

# Copy the compiled application binary from the builder stage
COPY --from=builder /app/pocketbase-app .

# PocketBase needs its migrations and public assets to run.
# Ensure 'pb_migrations' and 'pb_public' folders are in your 'backend' directory.
COPY ./pb_migrations ./pb_migrations
COPY ./pb_public ./pb_public
COPY ./views ./views

# Expose the default PocketBase port
EXPOSE 8090

# Command to run the application.
# It serves on 0.0.0.0 to be accessible from outside the container.
# The data directory (pb_data) will be created inside the container.
# IMPORTANT: You should mount a volume to /app/pb_data to persist your data.
CMD ["./pocketbase-app", "serve", "--http=0.0.0.0:8090"]