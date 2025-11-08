FROM node:20-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./


RUN npm install -g pnpm

RUN pnpm install 

COPY . .


ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_PORT
ENV VITE_PORT=$VITE_PORT

RUN pnpm run build

FROM nginx:alpine as production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf



EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
