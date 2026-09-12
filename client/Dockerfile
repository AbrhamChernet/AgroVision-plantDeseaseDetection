# Stage 1: Build the React 19 + Vite frontend
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Set API URL - defaults to relative /api for Nginx reverse proxy, can be overridden via --build-arg
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve the production build with high-performance Nginx Alpine
FROM nginx:alpine

# Copy built assets to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV PORT=80
ENV BACKEND_URL=http://server:5000

EXPOSE 80

# Dynamically inject PORT and BACKEND_URL into default.conf before starting Nginx
CMD ["/bin/sh", "-c", "TARGET_URL=$(echo \"${BACKEND_URL:-http://server:5000}\" | sed 's:/*$::') && sed -i \"s/__PORT__/${PORT:-80}/g\" /etc/nginx/conf.d/default.conf && sed -i \"s|__BACKEND_URL__|${TARGET_URL}|g\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

