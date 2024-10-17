FROM node:16-alpine as build

WORKDIR /chat-app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /chat-app/build /usr/share/nginx/html

#Nginx 설정을 수정하여 SPA 라우팅 문제 해결
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf