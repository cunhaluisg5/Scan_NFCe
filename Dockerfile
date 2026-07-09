FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ARG EXPO_PUBLIC_API_TIMEOUT_MS=15000
ARG EXPO_PUBLIC_HELP_URL=http://localhost:3001

ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_TIMEOUT_MS=$EXPO_PUBLIC_API_TIMEOUT_MS
ENV EXPO_PUBLIC_HELP_URL=$EXPO_PUBLIC_HELP_URL

RUN npm run build

FROM nginx:1.29-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
