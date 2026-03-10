# ==============================================================================
# Multi-stage build for Angular frontend
#
# Stage 1 (build): Node.js installs dependencies and runs ng build --configuration=production
# Stage 2 (runtime): Nginx serves the compiled static files
#
# Why multi-stage? The final image only contains Nginx + static files.
# No Node.js, no node_modules, no source code — image stays small (~50MB).
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build
# ------------------------------------------------------------------------------

# Use the official Node 20 Alpine image — matches the Node version on our runner.
# Alpine base keeps the build stage lean even though it's discarded afterward.
FROM node:20-alpine AS build

# Set working directory inside the build container.
WORKDIR /app

# Copy package.json and package-lock.json first — before copying source code.
# Docker layer caching: if these files haven't changed, npm ci is skipped on
# subsequent builds, saving significant time.
COPY package.json package-lock.json ./

# Install dependencies using the lockfile for reproducible installs.
# --frozen-lockfile ensures no accidental dependency upgrades during CI.
RUN npm ci

# Copy the rest of the source code.
# Done after npm ci so dependency installation is cached independently.
COPY . .

# Build the Angular app in production mode.
# --configuration=production triggers environment.ts replacement with
# environment file and enables optimisation, tree-shaking, and minification.
RUN npx ng build --configuration=production

# ------------------------------------------------------------------------------
# Stage 2: Runtime
# ------------------------------------------------------------------------------

# Use the official Nginx Alpine image — minimal, production-grade web server.
FROM nginx:alpine

# Remove the default Nginx welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled Angular app from the build stage.
# Angular 19 outputs to dist/<project-name>/browser/ by default.
COPY --from=build /app/dist/utility-account-ui/browser /usr/share/nginx/html

# Copy our custom Nginx config (mounted via docker-compose, but we also
# bake a default in so the image works standalone if needed).
# The actual nginx.conf will be bind-mounted by docker-compose in production.
EXPOSE 80

# Start Nginx in the foreground — required for Docker (no daemon mode).
CMD ["nginx", "-g", "daemon off;"]