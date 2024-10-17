FROM node:16-alpine as build

WORKDIR /pub-sub-project

COPY package.json ./
RUN npm ci

COPY . .

# Final stage
FROM node:16-alpine 
WORKDIR /pub-sub-project

COPY --from=build /pub-sub-project .

CMD ["node", "index.js"]