/**
 * Dockerfile mẫu dùng chung cho các đề Chương 17 (tệp "_" ⇒ bộ xuất bỏ qua). Chỉ là chuỗi — đề nào cần thì nhúng vào kiểm.
 * Lấy theo đúng các tệp trong bài 17.1–17.4 (naive / slim / multi-stage / có bí mật).
 */
export const NAIVE = `FROM node:22
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]`;

export const SLIM = `FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production
USER node
CMD ["node", "src/index.js"]`;

export const MULTI = `# syntax=docker/dockerfile:1
FROM node:22.23.4-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.23.4-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22.23.4-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
USER node
CMD ["node", "dist/index.js"]`;

export const MULTI_LEAKY = `FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]`;
