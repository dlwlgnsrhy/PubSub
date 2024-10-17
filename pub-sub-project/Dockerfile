# Stage 1: Build the application
FROM node:16-alpine as build

WORKDIR /pub-sub-project

COPY package.json ./
RUN npm install

COPY . .

# TypeScript를 JavaScript로 컴파일
RUN npm run build

# Stage 2: Run the application
FROM node:16-alpine
WORKDIR /pub-sub-project

# 이전 단계에서 생성된 빌드 결과물 복사
COPY --from=build /pub-sub-project/dist ./dist
COPY --from=build /pub-sub-project/node_modules ./node_modules

# 앱 시작 명령
CMD ["node", "dist/main.js"]
