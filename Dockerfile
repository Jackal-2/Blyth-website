# Multi-stage build using Next's standalone output (see next.config.ts).
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs blyth

COPY --from=build /app/public ./public
COPY --from=build --chown=blyth:nodejs /app/.next/standalone ./
COPY --from=build --chown=blyth:nodejs /app/.next/static ./.next/static

USER blyth
EXPOSE 3002
ENV PORT=3002

CMD ["node", "server.js"]
