FROM node:22.12-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
# COPY package-lock.json ./
COPY tsconfig.json ./

# Install dependencies
# RUN npm ci --only=production
RUN npm install --only=production

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV TRANSPORT_TYPE=stdio

# Run in production mode
CMD ["node", "dist/index.js"]


# Commin-Message: remove package-lock.json from Dockerfile
# Commin-Message: RUN npm install --only=production
