FROM --platform=linux/arm64 node:18-bullseye-slim AS base

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 仅复制依赖清单并安装生产依赖
COPY package*.json ./
RUN pnpm install --prod \
  && pnpm add @resvg/resvg-js-linux-arm64-gnu@2.6.2 \
  && pnpm store prune

# 拷贝剩余源码
COPY . .

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
