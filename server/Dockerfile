FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy server code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
