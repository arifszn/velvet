# Build stage
FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Runtime stage
FROM node:22-slim as runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .
ARG APP_PORT
EXPOSE ${APP_PORT}
CMD ["npm", "run", "start:prod"]